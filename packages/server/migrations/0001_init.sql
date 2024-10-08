-- CreateTable
CREATE TABLE "Api" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME,
    "deleted" INTEGER NOT NULL DEFAULT 0,
    "req_params" TEXT,
    "req_body" TEXT,
    "req_headers" TEXT,
    "req_cookies" TEXT,
    "req_auth" TEXT,
    "res_status" INTEGER NOT NULL,
    "res_headers" TEXT,
    "res_response_type" TEXT,
    "res_body" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Api_path_key" ON "Api"("path");
