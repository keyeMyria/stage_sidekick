# == Schema Information
#
# Table name: users
#
#  id            :integer          not null, primary key
#  first_name    :string(50)       not null
#  last_name     :string(50)       not null
#  email         :string(255)      not null
#  username      :string(20)       not null
#  default_title :string(50)
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  phone_number  :string(20)
#

class User < ApplicationRecord
  has_many :roles
  has_one :actor_measurement
end
