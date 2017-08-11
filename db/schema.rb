# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170810232411) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "characters", force: :cascade do |t|
    t.string   "name",        limit: 50,   null: false
    t.integer  "scene_id",                 null: false
    t.string   "description", limit: 1000
    t.string   "type",        limit: 20
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
    t.index ["scene_id"], name: "index_characters_on_scene_id", using: :btree
  end

  create_table "costumes", force: :cascade do |t|
    t.string   "title",         limit: 75,   null: false
    t.string   "description",   limit: 1000
    t.integer  "production_id",              null: false
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.index ["production_id"], name: "index_costumes_on_production_id", using: :btree
  end

  create_table "productions", force: :cascade do |t|
    t.string   "title",      limit: 50, null: false
    t.integer  "venue_id",              null: false
    t.string   "status",     limit: 15
    t.date     "start_date"
    t.date     "end_date"
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
    t.index ["venue_id"], name: "index_productions_on_venue_id", using: :btree
  end

  create_table "scenes", force: :cascade do |t|
    t.string   "title",             limit: 75,   null: false
    t.integer  "production_id",                  null: false
    t.string   "description",       limit: 1000
    t.integer  "order_index"
    t.integer  "length_in_minutes"
    t.string   "setting",           limit: 30
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
    t.index ["production_id"], name: "index_scenes_on_production_id", using: :btree
  end

  create_table "users", force: :cascade do |t|
    t.string   "first_name",    limit: 50,  null: false
    t.string   "last_name",     limit: 50,  null: false
    t.string   "email",         limit: 255, null: false
    t.string   "username",      limit: 20,  null: false
    t.string   "default_title", limit: 50
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "venues", force: :cascade do |t|
    t.string   "name",        limit: 100,  null: false
    t.string   "description", limit: 5000
    t.string   "type",        limit: 30
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

end