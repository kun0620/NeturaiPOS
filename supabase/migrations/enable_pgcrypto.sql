/*
      # Enable pgcrypto Extension

      1. Security
        - Enables the `pgcrypto` extension, which provides cryptographic functions like `gen_salt` and `crypt`.
        - This is necessary for password hashing in user management.
    */

    CREATE EXTENSION IF NOT EXISTS pgcrypto;