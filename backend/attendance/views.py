from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Attendance
from .serializers import AttendanceSerializer


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.select_related('employee').all()
    serializer_class = AttendanceSerializer
    http_method_names = ['get', 'post', 'put', 'delete']

    def get_queryset(self):
        queryset = Attendance.objects.select_related('employee').all()
        employee_id = self.request.query_params.get('employee')
        date = self.request.query_params.get('date')
        if employee_id:
            queryset = queryset.filter(employee__id=employee_id)
        if date:
            queryset = queryset.filter(date=date)
        return queryset

    @action(detail=False, methods=['get'], url_path='summary/(?P<employee_id>[^/.]+)')
    def summary(self, request, employee_id=None):
        records = Attendance.objects.filter(employee__id=employee_id)
        return Response({
            "employee_id": employee_id,
            "total_days": records.count(),
            "present": records.filter(status='present').count(),
            "absent": records.filter(status='absent').count(),
        }, status=status.HTTP_200_OK)
