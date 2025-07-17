from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.db import transaction
from cloudinary.uploader import upload
from .models import CCA, CCAMember, TrainingSession, Attendance
from .serializers import CCAListSerializer, CCADetailSerializer, CCAMemberSerializer, TrainingSessionSerializer, AttendanceSerializer, LogoUploadSerializer


class IsCCAMember(permissions.BasePermission):
    """
    Allows access only to active members of a specific CCA.
    """

    def has_permission(self, request, view):
        cca_id = view.kwargs.get('cca_id')
        if not cca_id:
            return False  # No CCA ID provided in URL
        try:
            cca = CCA.objects.get(id=cca_id)
            return CCAMember.objects.filter(cca=cca, user=request.user, is_active=True).exists()
        except CCA.DoesNotExist:
            return False


class CCAListView(generics.ListAPIView):
    """
    GET /api/cca/list/
    List all active CCAs
    """
    queryset = CCA.objects.all()
    serializer_class = CCAListSerializer
    permission_classes = []


class CCADetailView(generics.RetrieveAPIView):
    """
    GET /api/cca/{cca_id}/
    Get detailed information about a specific CCA
    """
    queryset = CCA.objects.all()
    serializer_class = CCADetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_url_kwarg = 'cca_id'


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsCCAMember])
@parser_classes([MultiPartParser, FormParser])
def upload_logo(request, cca_id):
    """Upload/update user logo picture to Cloudinary"""
    cca = get_object_or_404(CCA, id=cca_id)
    try:
        member = CCAMember.objects.get(cca=cca, user=request.user)
        if member.position == 'member':
            return Response(
                {"error": "Only committee members can upload logos"},
                status=status.HTTP_403_FORBIDDEN
            )
    except CCAMember.DoesNotExist:
        return Response(
            {"error": "You must be a member of this CCA to can upload logos"},
            status=status.HTTP_403_FORBIDDEN
        )
    serializer = LogoUploadSerializer(data=request.data)

    if serializer.is_valid():
        try:
            image_file = serializer.validated_data['logo']

            # Delete old logo if exists
            if cca.logo:
                cca.delete_old_logo()
            public_id = f"{cca.name.replace(' ', '_')}_logo"
            # Upload new image to Cloudinary
            upload_result = upload(
                image_file,
                folder="sportsync/cca_logo/",
                public_id=public_id,
                transformation=[
                    {'width': 300, 'height': 300, 'crop': 'fill', 'gravity': 'face'},
                    {'quality': 'auto'},
                    {'fetch_format': 'auto'}
                ],
                overwrite=True,
                resource_type="image"
            )

            # Update user logo picture field
            cca.logo = upload_result['public_id']
            cca.save()

            return Response({
                'message': 'Logo uploaded successfully',
                'logo_url': upload_result['secure_url'],
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': f'Upload failed: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CCAMembersView(generics.GenericAPIView):
    """
    GET /api/cca/{cca_id}/members/    - List all members of a CCA
    POST /api/cca/{cca_id}/members/   - Add a new member to a CCA
    """
    permission_classes = [permissions.IsAuthenticated, IsCCAMember]
    serializer_class = CCAMemberSerializer
    # Check if user is a member of this CCA

    def get_queryset(self):
        cca = get_object_or_404(CCA, id=self.kwargs['cca_id'])
        queryset = CCAMember.objects.filter(cca=cca)

        return queryset

    def get(self, request, cca_id):
        cca = get_object_or_404(CCA, id=cca_id)
        members = CCAMember.objects.filter(cca=cca)
        serializer = CCAMemberSerializer(members, many=True)
        return Response(serializer.data)

    def post(self, request, cca_id):
        cca = get_object_or_404(CCA, id=cca_id)
        member = CCAMember.objects.get(cca=cca, user=request.user)

        if member.position == 'member':
            return Response(
                {"error": "Only committee members can add members"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Create new membership
        data = request.data.copy()
        data['cca'] = cca.id

        # Check if user is already a member
        if CCAMember.objects.filter(cca=cca, user_id=data.get('user')).exists():
            return Response(
                {"error": "User is already a member of this CCA"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = CCAMemberSerializer(data=data)
        if serializer.is_valid():
            serializer.save()  # Fix: Don't pass cca again since it's in data
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CCATrainingView(generics.GenericAPIView):
    """
    GET /api/cca/{cca_id}/training/   - List all training sessions for a CCA
    POST /api/cca/{cca_id}/training/  - Create a new training session
    """
    permission_classes = [permissions.IsAuthenticated, IsCCAMember]
    serializer_class = TrainingSessionSerializer

    def get_queryset(self):
        cca = get_object_or_404(CCA, id=self.kwargs['cca_id'])
        queryset = TrainingSession.objects.filter(cca=cca)

        return queryset

    def get(self, request, cca_id):
        cca = get_object_or_404(CCA, id=cca_id)

        # Get query parameters for filtering
        upcoming_only = request.query_params.get(
            'upcoming', 'false').lower() == 'true'

        training_sessions = TrainingSession.objects.filter(cca=cca)

        if upcoming_only:
            from django.utils import timezone
            training_sessions = training_sessions.filter(
                date__gte=timezone.now().date())

        training_sessions = training_sessions.order_by('date', 'start_time')
        serializer = TrainingSessionSerializer(training_sessions, many=True)
        return Response(serializer.data)

    def post(self, request, cca_id):
        cca = get_object_or_404(CCA, id=cca_id)

        # Check if user is authorized to create training sessions
        # (must be committee member or above)
        try:
            member = CCAMember.objects.get(cca=cca, user=request.user)
            if member.position == 'member':
                return Response(
                    {"error": "Only committee members can create training sessions"},
                    status=status.HTTP_403_FORBIDDEN
                )
        except CCAMember.DoesNotExist:
            return Response(
                {"error": "You must be a member of this CCA to create training sessions"},
                status=status.HTTP_403_FORBIDDEN
            )

        data = request.data.copy()
        data['cca'] = cca.id

        serializer = TrainingSessionSerializer(data=data)
        if serializer.is_valid():
            serializer.save()  # Fix: Don't pass extra parameters
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Additional utility views for member and training management


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def join_training_session(request, cca_id, session_id):
    """
    POST /api/cca/{cca_id}/training/{session_id}/join/
    Join a training session
    """
    cca = get_object_or_404(CCA, id=cca_id)
    training_session = get_object_or_404(
        TrainingSession, id=session_id, cca=cca)

    # Check if user is a member of the CCA
    try:
        member = CCAMember.objects.get(
            cca=cca, user=request.user, is_active=True)
    except CCAMember.DoesNotExist:
        return Response(
            {"error": "You must be a member of this CCA to join training sessions"},
            status=status.HTTP_403_FORBIDDEN
        )

    # Check if already registered
    if Attendance.objects.filter(training_session=training_session, member=member).exists():
        return Response(
            {"error": "Already registered for this training session"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Determine registration status based on capacity
    if training_session.is_full:
        attendance_status = 'waitlisted'
    else:
        attendance_status = 'registered'

    attendance = Attendance.objects.create(
        training_session=training_session,
        member=member,
        status=attendance_status
    )

    serializer = AttendanceSerializer(attendance)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def leave_training_session(request, cca_id, session_id):
    """
    DELETE /api/cca/{cca_id}/training/{session_id}/leave/
    Leave a training session
    """
    cca = get_object_or_404(CCA, id=cca_id)
    training_session = get_object_or_404(
        TrainingSession, id=session_id, cca=cca)

    try:
        member = CCAMember.objects.get(
            cca=cca, user=request.user, is_active=True)
        attendance = Attendance.objects.get(
            training_session=training_session, member=member)

        with transaction.atomic():
            attendance.delete()

            # If someone was waitlisted, move them to registered
            waitlisted = Attendance.objects.filter(
                training_session=training_session,
                status='waitlisted'
            ).order_by('registered_at').first()

            if waitlisted:
                waitlisted.status = 'registered'
                waitlisted.save()

        return Response({"message": "Successfully left training session"})

    except CCAMember.DoesNotExist:
        return Response(
            {"error": "You are not a member of this CCA"},
            status=status.HTTP_403_FORBIDDEN
        )
    except Attendance.DoesNotExist:
        return Response(
            {"error": "You are not registered for this training session"},
            status=status.HTTP_400_BAD_REQUEST
        )
