#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE shopflow_auth;
    CREATE DATABASE shopflow_products;
    CREATE DATABASE shopflow_orders;
EOSQL
