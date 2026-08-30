package config

import (
	"log"
	"net/url"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// buildDSN menyusun connection string Postgres dalam format URL.
//
// Format URL dipakai (bukan keyword=value seperti "host=... password=...")
// karena nilai kosong atau berkarakter spesial di-escape otomatis oleh
// net/url. Dengan format keyword=value, DB_PASSWORD yang kosong
// menghasilkan "password= dbname=parago_db", dan parser libpq gagal
// membaca dbname setelahnya — koneksi diam-diam jatuh ke database default
// (nama user), sehingga migrasi menulis tabel ke database yang salah.
//
// client_encoding dipaksa UTF8, bukan mengandalkan default server: beberapa
// instalasi Postgres lokal (mis. Windows dengan locale non-English) punya
// default client_encoding bukan UTF8, yang bikin pgx menolak query dengan
// error "simple protocol queries must be run with client_encoding=UTF8".
func buildDSN() string {
	query := url.Values{}
	query.Set("sslmode", GetEnv("DB_SSLMODE", "disable"))
	query.Set("client_encoding", "UTF8")

	dsn := url.URL{
		Scheme:   "postgres",
		User:     url.UserPassword(GetEnv("DB_USER", "postgres"), os.Getenv("DB_PASSWORD")),
		Host:     GetEnv("DB_HOST", "localhost") + ":" + GetEnv("DB_PORT", "5432"),
		Path:     GetEnv("DB_NAME", "parago_db"),
		RawQuery: query.Encode(),
	}
	return dsn.String()
}

func ConnectDB() *gorm.DB {
	db, err := gorm.Open(postgres.Open(buildDSN()), &gorm.Config{})
	if err != nil {
		log.Fatalf("Gagal konek ke database: %v", err)
	}

	log.Println("Berhasil konek ke database")
	return db
}
