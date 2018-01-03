# == Schema Information
#
# Table name: roles
#
#  id            :integer          not null, primary key
#  user_id       :integer          not null
#  production_id :integer
#  venue_id      :integer          not null
#  title         :string
#  department    :string
#  status        :string
#  start_date    :date
#  end_date      :date
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  first_name    :string
#  last_name     :string
#  avatar        :string
#  display_image :string
#  type          :string
#  order_index   :integer
#
# Indexes
#
#  index_roles_on_production_id  (production_id)
#  index_roles_on_user_id        (user_id)
#  index_roles_on_venue_id       (venue_id)
#

class Actor < Role
  has_many :characters_roles, dependent: :destroy, foreign_key: :role_id
  has_many :characters, through: :characters_roles

  has_many :characters_scenes, through: :characters
  has_many :scenes, through: :characters_scenes

  belongs_to :user
  has_one :actor_measurement, through: :user

  after_create do |actor|
    if actor.order_index.nil?
      actor.order_index = actor.id
      actor.save!
    end
  end

end