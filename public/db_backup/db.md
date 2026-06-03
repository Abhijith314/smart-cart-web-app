## Table `users`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `email` | `text` |  Nullable |
| `phoneNumber` | `numeric` |  Nullable Unique |
| `id` | `numeric` | Primary Unique |
| `last_time_spend` | `float4` |  Nullable |
| `avg_time` | `float8` |  Nullable |
| `last_spend` | `float8` |  Nullable |
| `avg_spend` | `float8` |  Nullable |
| `last_purchase` | `timestamp` |  Nullable |
| `created_at` | `timestamptz` |  |
| `username` | `text` |  Nullable |
| `total_purchase` | `int4` |  Nullable |

## Table `inventory`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `product_id` | `int4` |  |
| `barcode` | `text` | Primary Unique |
| `product_name` | `text` |  |
| `mrp` | `numeric` |  |
| `tax_rate` | `numeric` |  |
| `quantity_value` | `numeric` |  |
| `quantity_unit` | `text` |  |
| `stock_quantity` | `int4` |  |
| `reorder_level` | `int4` |  |

## Table `billing`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `transaction_id` | `uuid` |  Nullable |
| `bill_id` | `uuid` | Primary |
| `purchase_items` | `json` |  Nullable |
| `subtotal` | `numeric` |  Nullable |
| `grand_total` | `numeric` |  Nullable |
| `total_discount` | `numeric` |  Nullable |
| `payment_status` | `text` |  |
| `created_at` | `timestamptz` |  |
| `user_id` | `numeric` |  Nullable |

## Table `orders`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `order_id` | `uuid` | Primary |
| `created_at` | `timestamp` |  Nullable |
| `bill_id` | `uuid` |  |
| `total_amount` | `numeric` |  Nullable |
| `payment_status` | `text` |  Nullable |
| `user_id` | `numeric` |  Nullable |
| `cart_id` | `text` |  Nullable |

