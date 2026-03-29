# CRITICAL AGENT INSTRUCTIONS

## 🔴 DIRECT DATABASE ACCESS

**YOU HAVE DIRECT DATABASE ACCESS TO SUPABASE!**

### DO NOT:
- ❌ Ask the user if you should check the database
- ❌ Rely on old documentation files
- ❌ Guess what's in the database
- ❌ Ask permission to query the database

### DO:
- ✅ Use `kiroPowers` with `supabase-hosted` to query the database DIRECTLY
- ✅ Check the ACTUAL database structure before making assumptions
- ✅ Verify data exists before writing code that depends on it
- ✅ Use `list_tables` to see what tables exist
- ✅ Use `execute_sql` to query data directly

### How to Access Database:

1. **List all projects:**
```
kiroPowers → action: "use" → toolName: "list_projects"
```

2. **See all tables:**
```
kiroPowers → action: "use" → toolName: "list_tables"
project_id: "gcbmlxdxwakkubpldype"
schemas: ["public"]
verbose: true
```

3. **Query data:**
```
kiroPowers → action: "use" → toolName: "execute_sql"
project_id: "gcbmlxdxwakkubpldype"
query: "SELECT * FROM members LIMIT 1;"
```

4. **Apply migrations:**
```
kiroPowers → action: "use" → toolName: "apply_migration"
project_id: "gcbmlxdxwakkubpldype"
name: "migration_name"
query: "ALTER TABLE..."
```

## Database Info

**Project ID:** gcbmlxdxwakkubpldype  
**Project Name:** plus1  
**Region:** eu-west-1  
**Status:** ACTIVE_HEALTHY

## Current Schema (as of 2026-03-29)

**Role Tables (NO central users table):**
- `members` - Customers (includes admin role)
- `partners` - Shops offering cashback
- `agents` - Sales people recruiting partners
- `insurers` - Medical policy providers (renamed from providers)
- `drivers` - Delivery drivers

**Authentication:** Each role table has mobile_number, pin_code, pin_hash

## When Working on Database Issues:

1. **ALWAYS check the actual database first** using kiroPowers
2. **NEVER trust old documentation** - verify everything
3. **Query before you code** - see what data actually exists
4. **Use verbose: true** when listing tables to see full structure
5. **Test queries** before applying migrations

## Remember:

**THE DATABASE IS THE SOURCE OF TRUTH, NOT DOCUMENTATION FILES!**
