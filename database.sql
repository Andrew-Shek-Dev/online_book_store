create database online_bookstore;

create user store_admin superuser;

alter user store_admin with encrypted password '123456';

grant all privileges on database online_bookstore to store_admin;

create table role (id serial primary key,name varchar(255) not null);

insert into role (name) values ('admin'),('seller'),('buyer');

create table members (user_id serial primary key, username varchar(255) not null, password varchar(255) not null, role integer not null, profile_url varchar(255), foreign key(role) references role(id));

create table product (id serial primary key, title varchar(255) not null,description varchar(255), price float default 0, image varchar(255), quantity integer default 0);

create table cart (id serial primary key, cart_id integer, member_id integer, product_id integer, payment boolean default false, quantity integer default 0,foreign key(member_id) references members(user_id), foreign key(product_id) references product(id));

create table invoice (id serial primary key,cart_id integer,invoice varchar(225));

alter table product drop column quantity;

alter table cart add column quantity integer default 0;

alter table product add column owner_id integer;

update product set owner_id = 4;