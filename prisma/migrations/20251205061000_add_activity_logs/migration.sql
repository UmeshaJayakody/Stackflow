-- CreateTable
CREATE TABLE "activity_logs" (
    "log_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "action" VARCHAR(50) NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" INTEGER,
    "entity_name" VARCHAR(255),
    "details" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("log_id")
);

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
