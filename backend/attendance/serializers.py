from rest_framework import serializers
from .models import Attendance
from employees.models import Employee
from employees.serializers import EmployeeSerializer


class AttendanceSerializer(serializers.ModelSerializer):
    employee_detail = EmployeeSerializer(source='employee', read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'employee', 'employee_detail', 'date', 'status', 'created_at']
        read_only_fields = ['id', 'created_at', 'employee_detail']

    def validate_status(self, value):
        if value.lower() not in ['present', 'absent']:
            raise serializers.ValidationError("Status must be either 'present' or 'absent'.")
        return value.lower()

    def validate(self, data):
        employee = data.get('employee')
        date = data.get('date')
        instance = self.instance

        if employee and date:
            qs = Attendance.objects.filter(employee=employee, date=date)
            if instance:
                qs = qs.exclude(pk=instance.pk)
            if qs.exists():
                raise serializers.ValidationError(
                    "Attendance for this employee on this date has already been marked."
                )
        return data
