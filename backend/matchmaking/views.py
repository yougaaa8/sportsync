from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import Lobby, LobbyMember
from .serializers import LobbyListSerializer, LobbyDetailSerializer, LobbyMemberSerializer


class IsLobbyMember(permissions.BasePermission):
    """
    Allows access only to active members of a specific Lobby.
    """

    def has_permission(self, request, view):
        lobby_id = view.kwargs.get('lobby_id') or view.kwargs.get('id')
        if not lobby_id:
            return False
        try:
            lobby = Lobby.objects.get(id=lobby_id)
            return LobbyMember.objects.filter(lobby=lobby, user=request.user).exists()
        except Lobby.DoesNotExist:
            return False


class LobbyListView(generics.ListAPIView):
    """
    GET /api/lobbies/list/
    List all active Lobbies
    """
    queryset = Lobby.objects.all()
    serializer_class = LobbyListSerializer
    permission_classes = []


class LobbyCreateView(generics.CreateAPIView):
    """
    POST /api/lobbies/create/
    Create a new Lobby
    """
    serializer_class = LobbyDetailSerializer

    def perform_create(self, serializer):
        lobby = serializer.save()
        LobbyMember.objects.create(
            user=self.request.user,
            lobby=lobby,
            status='admin'
        )


class LobbyDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /api/lobbies/{id}/
    Retrieve detailed information about a specific Lobby.
    PUT/PATCH /api/lobbies/{id}/
    Update a Lobby's details (admin only).
    DELETE /api/lobbies/{id}/
    Delete a Lobby (admin only).
    """
    queryset = Lobby.objects.all()
    serializer_class = LobbyDetailSerializer
    permission_classes = [permissions.IsAuthenticated, IsLobbyMember]

    def get_object(self):
        return get_object_or_404(Lobby, id=self.kwargs['id'])

    def update(self, request, *args, **kwargs):
        lobby = self.get_object()
        # Only allow admins to update
        try:
            member = LobbyMember.objects.get(lobby=lobby, user=request.user)
            if member.status != 'admin':
                return Response(
                    {"error": "Only administrators can edit the lobby."},
                    status=status.HTTP_403_FORBIDDEN
                )
        except LobbyMember.DoesNotExist:
            return Response(
                {"error": "You are not a member of this lobby."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        lobby = self.get_object()
        # Only allow admins to delete
        try:
            member = LobbyMember.objects.get(lobby=lobby, user=request.user)
            if member.status != 'admin':
                return Response(
                    {"error": "Only administrators can delete the lobby."},
                    status=status.HTTP_403_FORBIDDEN
                )
        except LobbyMember.DoesNotExist:
            return Response(
                {"error": "You are not a member of this lobby."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().delete(request, *args, **kwargs)


class LobbyMembersView(generics.GenericAPIView):
    """
    GET /api/lobbies/{id}/members            - List all members of a Lobby
    POST /api/lobbies/{id}/members           - Add/edit a member
    """
    permission_classes = [permissions.IsAuthenticated, IsLobbyMember]
    serializer_class = LobbyMemberSerializer
    # Check if user is a member of this Lobby

    def get_queryset(self):
        lobby = get_object_or_404(Lobby, id=self.kwargs['id'])
        queryset = LobbyMember.objects.filter(lobby=lobby)

        return queryset

    def get(self, request, id):
        lobby = get_object_or_404(Lobby, id=id)
        members = LobbyMember.objects.filter(lobby=lobby)
        serializer = LobbyMemberSerializer(members, many=True)
        return Response(serializer.data)

    def post(self, request, id):
        lobby = get_object_or_404(Lobby, id=id)
        try:
            member = LobbyMember.objects.get(lobby=lobby, user=request.user)
            if member.status != 'admin':
                return Response(
                    {"error": "Only administrators can add members"},
                    status=status.HTTP_403_FORBIDDEN
                )
        except LobbyMember.DoesNotExist:
            return Response(
                {"error": "You are not a member of this lobby."},
                status=status.HTTP_403_FORBIDDEN
            )

        data = request.data.copy()
        data['lobby'] = lobby.id

        if LobbyMember.objects.filter(lobby=lobby, user_id=data.get('user')).exists():
            return Response(
                {"error": "User is already a member of this Lobby"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = LobbyMemberSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated, IsLobbyMember])
def delete_member(request, lobby_id, user_id):
    """
    DELETE /api/lobbies/{id}/members/
    Remove a member from the Lobby
    """
    lobby = get_object_or_404(Lobby, id=lobby_id)
    member = get_object_or_404(LobbyMember, lobby=lobby, user=request.user)

    if member.status != 'admin':
        return Response(
            {"error": "Only administrators can remove members"},
            status=status.HTTP_403_FORBIDDEN
        )

    if not user_id:
        return Response(
            {"error": "User ID must be provided to remove a member."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Prevent admin from removing themselves
    if int(user_id) == request.user.id:
        return Response(
            {"error": "Admins cannot remove themselves."},
            status=status.HTTP_400_BAD_REQUEST
        )

    member_to_remove = get_object_or_404(
        LobbyMember, lobby=lobby, user_id=user_id)
    member_to_remove.delete()
    return Response({"message": "Member removed successfully"}, status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def join_lobby(request, id):
    """
    POST /api/lobbies/{id}/join/
    Join a lobby
    """
    lobby = get_object_or_404(Lobby, id=id)

    # Check if already registered
    if LobbyMember.objects.filter(lobby=lobby, user=request.user).exists():
        return Response(
            {"error": "Already a member of this lobby"},
            status=status.HTTP_400_BAD_REQUEST
        )
    if lobby.is_full:
        return Response(
            {"error": "Lobby is full"},
            status=status.HTTP_400_BAD_REQUEST
        )
    # Add user to lobby
    LobbyMember.objects.create(lobby=lobby, user=request.user)
    return Response({"message": "Successfully joined lobby"}, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
def leave_lobby(request, id):
    """
    DELETE /api/lobbies/{id}/leave/
    Leave a lobby
    """
    lobby = get_object_or_404(Lobby, id=id)

    try:
        member = LobbyMember.objects.get(
            lobby=lobby, user=request.user)

        member.delete()

        return Response({"message": "Successfully left lobby"})
    except LobbyMember.DoesNotExist:
        return Response(
            {"error": "You are not a member of this lobby"},
            status=status.HTTP_400_BAD_REQUEST
        )
