// Package response menyediakan format response JSON yang seragam untuk
// seluruh endpoint API, supaya frontend tidak perlu menebak bentuk response
// beda-beda per handler.
//
// Bentuk envelope:
//
//	{ "success": true,  "data": {...}, "message": null }
//	{ "success": false, "data": null,  "message": "..." }
package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Envelope adalah bentuk baku seluruh response API.
type Envelope struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Message string      `json:"message,omitempty"`
}

// Success mengirim response sukses dengan status code custom.
func Success(ctx *gin.Context, code int, data interface{}) {
	ctx.JSON(code, Envelope{Success: true, Data: data})
}

// OK mengirim response sukses 200.
func OK(ctx *gin.Context, data interface{}) {
	Success(ctx, http.StatusOK, data)
}

// Created mengirim response sukses 201, dipakai setelah operasi create.
func Created(ctx *gin.Context, data interface{}) {
	Success(ctx, http.StatusCreated, data)
}

// Error mengirim response gagal dengan status code & pesan custom.
func Error(ctx *gin.Context, code int, message string) {
	ctx.JSON(code, Envelope{Success: false, Message: message})
}

// BadRequest mengirim response gagal 400 (input tidak valid).
func BadRequest(ctx *gin.Context, message string) {
	Error(ctx, http.StatusBadRequest, message)
}

// NotFound mengirim response gagal 404 (data tidak ditemukan).
func NotFound(ctx *gin.Context, message string) {
	Error(ctx, http.StatusNotFound, message)
}

// InternalError mengirim response gagal 500 (kegagalan tak terduga di server).
func InternalError(ctx *gin.Context, message string) {
	Error(ctx, http.StatusInternalServerError, message)
}
