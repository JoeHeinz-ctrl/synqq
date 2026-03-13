#!/bin/bash
# Run migration on startup
python migrate_postgresql.py
echo "Migration complete"
