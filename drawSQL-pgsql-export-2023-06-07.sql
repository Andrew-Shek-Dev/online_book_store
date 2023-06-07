CREATE TABLE "members"(
    "user_id" BIGINT NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(255) NOT NULL,
    "username" BIGINT NOT NULL,
    "profile_url" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "members" ADD PRIMARY KEY("user_id");
CREATE TABLE "invoice"(
    "id" BIGINT NOT NULL,
    "cart_id" BIGINT NOT NULL,
    "invoice" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "invoice" ADD PRIMARY KEY("id");
CREATE TABLE "cart"(
    "id" BIGINT NOT NULL,
    "cart_id" BIGINT NOT NULL,
    "member_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "payment" BOOLEAN NOT NULL,
    "quantity" BIGINT NOT NULL
);
ALTER TABLE
    "cart" ADD PRIMARY KEY("id");
CREATE TABLE "role"(
    "id" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "role" ADD PRIMARY KEY("id");
CREATE TABLE "product"(
    "id" BIGINT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "price" BIGINT NOT NULL,
    "image" VARCHAR(255) NOT NULL,
    "owner_id" BIGINT NOT NULL
);
ALTER TABLE
    "product" ADD PRIMARY KEY("id");
ALTER TABLE
    "cart" ADD CONSTRAINT "cart_cart_id_foreign" FOREIGN KEY("cart_id") REFERENCES "invoice"("cart_id");
ALTER TABLE
    "members" ADD CONSTRAINT "members_role_foreign" FOREIGN KEY("role") REFERENCES "role"("id");
ALTER TABLE
    "cart" ADD CONSTRAINT "cart_product_id_foreign" FOREIGN KEY("product_id") REFERENCES "product"("id");
ALTER TABLE
    "cart" ADD CONSTRAINT "cart_member_id_foreign" FOREIGN KEY("member_id") REFERENCES "members"("user_id");
ALTER TABLE
    "product" ADD CONSTRAINT "product_owner_id_foreign" FOREIGN KEY("owner_id") REFERENCES "members"("user_id");