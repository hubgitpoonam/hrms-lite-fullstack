from django.contrib import admin

# Register your models here.
from .models import Employee


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ['employee_id', 'full_name', 'email', 'department', 'created_at']
    search_fields = ['employee_id', 'full_name', 'email', 'department']
    ordering = ['-created_at']
