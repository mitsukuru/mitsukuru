class User < ApplicationRecord
  has_many :posts
  authenticates_with_sorcery!
  has_secure_password
  has_many :authentications, dependent: :destroy
  accepts_nested_attributes_for :authentications
end
