class User < ApplicationRecord
  has_many :posts
  has_many :authentications, dependent: :destroy
  authenticates_with_sorcery!
  has_secure_password
  accepts_nested_attributes_for :authentications
end
