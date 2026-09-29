package controller

import (
	"strconv"
	"time"

	"parago-backend/internal/models"
	"parago-backend/internal/repository"
	"parago-backend/internal/response"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// BookingController handles booking related endpoints.
type BookingController struct {
	Repo *repository.BookingRepository
}

func NewBookingController(repo *repository.BookingRepository) *BookingController {
	return &BookingController{Repo: repo}
}

// GetAllBookings returns a paginated list of bookings.
func (c *BookingController) GetAllBookings(ctx *gin.Context) {
	// Parse pagination query params (optional)
	pageStr := ctx.DefaultQuery("page", "1")
	limitStr := ctx.DefaultQuery("limit", "20")
	page, _ := strconv.Atoi(pageStr)
	limit, _ := strconv.Atoi(limitStr)
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 20
	}

	bookings, err := c.Repo.FindAll()
	if err != nil {
		response.InternalError(ctx, "Gagal mengambil data booking")
		return
	}

	// Simple slice pagination
	start := (page - 1) * limit
	end := start + limit
	if start > len(bookings) {
		start = len(bookings)
	}
	if end > len(bookings) {
		end = len(bookings)
	}
	paged := bookings[start:end]

	// Build response payload matching BookingOverviewItem fields needed by frontend
	type BookingOverviewItem struct {
		ID              string `json:"id"`
		BookingCode     string `json:"bookingCode"`
		Status          string `json:"status"`
		TransactionDate string `json:"transactionDate"`
		Vehicle         struct {
			Name      string `json:"name"`
			Type      string `json:"type"`
			Thumbnail string `json:"thumbnail"`
		} `json:"vehicle"`
		StartDate string  `json:"startDate"`
		EndDate   string  `json:"endDate"`
		Duration  string  `json:"duration"`
		Driver    string  `json:"driver"`
		Route     string  `json:"route"`
		TotalCost float64 `json:"totalCost"`
	}

	overview := make([]BookingOverviewItem, 0, len(paged))
	for _, b := range paged {
		// Map fields – adapt as needed
		var vtype string
		if b.Vehicle != nil && b.Vehicle.Model != nil {
			vtype = b.Vehicle.Model.Name
		}
		overview = append(overview, BookingOverviewItem{
			ID:              b.ID.String(),
			BookingCode:     b.ID.String(), // placeholder; replace with real code if exists
			Status:          b.Status,
			TransactionDate: b.CreatedAt.Format("02 Jan 2006"),
			Vehicle: struct {
				Name      string `json:"name"`
				Type      string `json:"type"`
				Thumbnail string `json:"thumbnail"`
			}{Name: b.Vehicle.Model.Name, Type: vtype, Thumbnail: "/vehicles/default.jpg"},
			StartDate: b.StartDatetime.Format("02 Jan 2006"),
			EndDate:   b.EndDatetime.Format("02 Jan 2006"),
			Duration:  strconv.FormatFloat(b.EndDatetime.Sub(b.StartDatetime).Hours(), 'f', 1, 64) + "h",
			Driver:    "",
			Route:     b.Purpose,
			TotalCost: float64(b.PassengerCount) * 1000, // placeholder calculation
		})
	}

	// Include pagination meta if needed
	meta := map[string]interface{}{"page": page, "limit": limit, "total": len(bookings)}
	response.OK(ctx, map[string]interface{}{"data": overview, "meta": meta})
}

// CreateBookingRequest represents the incoming booking creation payload.
type CreateBookingRequest struct {
	DivisionID       string   `json:"division_id" binding:"required"`
	VehicleID        string   `json:"vehicle_id" binding:"required"`
	DriverID         *string  `json:"driver_id,omitempty"`
	NeedsDriver      bool     `json:"needs_driver"`
	StartDatetime    string   `json:"start_datetime" binding:"required"`
	EndDatetime      string   `json:"end_datetime" binding:"required"`
	Purpose          string   `json:"purpose"`
	Destination      string   `json:"destination"`
	DestinationLat   *float64 `json:"destination_lat,omitempty"`
	DestinationLng   *float64 `json:"destination_lng,omitempty"`
	PickupName       *string  `json:"pickup_name,omitempty"`
	PickupAddress    *string  `json:"pickup_address,omitempty"`
	PickupLat        *float64 `json:"pickup_lat,omitempty"`
	PickupLng        *float64 `json:"pickup_lng,omitempty"`
	PassengerCount   int      `json:"passenger_count" binding:"required,min=1"`
}

// CreateBooking handles POST /bookings
func (c *BookingController) CreateBooking(ctx *gin.Context) {
	userID, exists := ctx.Get("logged_in_user")
	if !exists {
		response.BadRequest(ctx, "User not authenticated")
		return
	}
	requesterID, ok := userID.(uuid.UUID)
	if !ok {
		response.BadRequest(ctx, "Invalid user ID")
		return
	}

	var req CreateBookingRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		response.BadRequest(ctx, err.Error())
		return
	}

	divisionID, err := uuid.Parse(req.DivisionID)
	if err != nil {
		response.BadRequest(ctx, "Invalid division_id")
		return
	}
	vehicleID, err := uuid.Parse(req.VehicleID)
	if err != nil {
		response.BadRequest(ctx, "Invalid vehicle_id")
		return
	}

	var driverID *uuid.UUID
	if req.DriverID != nil && *req.DriverID != "" {
		did, err := uuid.Parse(*req.DriverID)
		if err != nil {
			response.BadRequest(ctx, "Invalid driver_id")
			return
		}
		driverID = &did
	}

	startDt, err := parseTime(req.StartDatetime)
	if err != nil {
		response.BadRequest(ctx, "Invalid start_datetime format (use RFC3339)")
		return
	}
	endDt, err := parseTime(req.EndDatetime)
	if err != nil {
		response.BadRequest(ctx, "Invalid end_datetime format (use RFC3339)")
		return
	}
	if endDt.Before(startDt) {
		response.BadRequest(ctx, "end_datetime must be after start_datetime")
		return
	}

	booking := &models.Booking{
		RequesterID:      requesterID,
		DivisionID:       divisionID,
		VehicleID:        vehicleID,
		DriverID:         driverID,
		NeedsDriver:      req.NeedsDriver,
		StartDatetime:    startDt,
		EndDatetime:      endDt,
		Purpose:          req.Purpose,
		Destination:      req.Destination,
		DestinationLat:   req.DestinationLat,
		DestinationLng:   req.DestinationLng,
		PickupName:       req.PickupName,
		PickupAddress:    req.PickupAddress,
		PickupLat:        req.PickupLat,
		PickupLng:        req.PickupLng,
		PassengerCount:   req.PassengerCount,
		Status:           models.BookingStatusPendingAdmin,
	}

	if err := c.Repo.Create(booking); err != nil {
		response.InternalError(ctx, "Gagal membuat booking")
		return
	}

	response.Created(ctx, map[string]string{"id": booking.ID.String()})
}

func parseTime(s string) (time.Time, error) {
	return time.Parse(time.RFC3339, s)
}
