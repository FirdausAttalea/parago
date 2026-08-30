package models

// Role user, sesuai PRD bagian 3.
const (
	RoleEmployee     = "employee"
	RoleFleetAdmin   = "fleet_admin"
	RoleDivisionHead = "division_head"
	RoleSuperAdmin   = "super_admin"
)

// Status operasional Vehicle, sesuai PRD bagian 6.3.
const (
	VehicleStatusActive      = "active"
	VehicleStatusMaintenance = "maintenance"
	VehicleStatusRetired     = "retired"
)

// Status ketersediaan Driver, sesuai PRD bagian 6.3.
const (
	DriverStatusAvailable = "available"
	DriverStatusOnDuty    = "on_duty"
	DriverStatusResigned  = "resigned"
)

// Status lifecycle Booking, sesuai PRD bagian 4.5.
const (
	BookingStatusPendingAdmin    = "pending_admin"
	BookingStatusPendingDivision = "pending_division"
	BookingStatusApproved        = "approved"
	BookingStatusOngoing         = "ongoing"
	BookingStatusCompleted       = "completed"
	BookingStatusRejected        = "rejected"
	BookingStatusCancelled       = "cancelled"
)
