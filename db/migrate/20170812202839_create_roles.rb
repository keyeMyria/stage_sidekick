class CreateRoles < ActiveRecord::Migration[5.0]
  def change

    create_table :roles do |t|
      t.belongs_to :user, null: false, index: true
      t.belongs_to :production, null: true, index: true
      t.belongs_to :venue, null: false, index: true
      t.string :title
      t.string :department
      t.string :status
      t.string :type
      t.date :start_date
      t.date :end_date
      t.timestamps
    end

    drop_table :members

    add_column :users, :phone_number, :string, limit: 20

    rename_column :members_characters, :member_id, :role_id
    rename_table :members_characters, :characters_roles
  end
end
