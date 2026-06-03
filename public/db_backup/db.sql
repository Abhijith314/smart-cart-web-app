-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.users (
  email text,
  phoneNumber numeric UNIQUE,
  id numeric NOT NULL UNIQUE,
  last_time_spend real,
  avg_time double precision,
  last_spend double precision,
  avg_spend double precision,
  last_purchase timestamp without time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  username text,
  total_purchase integer DEFAULT 0,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE TABLE public.inventory (
  product_id integer NOT NULL,
  barcode text NOT NULL UNIQUE,
  product_name text NOT NULL,
  mrp numeric NOT NULL,
  tax_rate numeric NOT NULL,
  quantity_value numeric NOT NULL,
  quantity_unit text NOT NULL DEFAULT ''::text,
  stock_quantity integer NOT NULL,
  reorder_level integer NOT NULL,
  CONSTRAINT inventory_pkey PRIMARY KEY (barcode)
);
CREATE TABLE public.billing (
  transaction_id uuid,
  bill_id uuid NOT NULL DEFAULT gen_random_uuid(),
  purchase_items json,
  subtotal numeric,
  grand_total numeric,
  total_discount numeric,
  payment_status text NOT NULL DEFAULT 'paid'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id numeric,
  CONSTRAINT billing_pkey PRIMARY KEY (bill_id)
);
CREATE TABLE public.orders (
  order_id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp without time zone DEFAULT now(),
  bill_id uuid NOT NULL DEFAULT gen_random_uuid(),
  total_amount numeric,
  payment_status text DEFAULT 'pending'::text,
  user_id numeric,
  cart_id text,
  CONSTRAINT orders_pkey PRIMARY KEY (order_id),
  CONSTRAINT orders_bill_id_fkey FOREIGN KEY (bill_id) REFERENCES public.billing(bill_id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);