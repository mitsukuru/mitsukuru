class User < ApplicationRecord
            # # Include default devise modules.
            # devise :database_authenticatable, :registerable,
            #         :recoverable, :rememberable, :trackable, :validatable,
            #         :confirmable, :omniauthable
            # include DeviseTokenAuth::Concerns::User
  authenticates_with_sorcery!
  has_secure_password
  has_many :authentications, dependent: :destroy
  accepts_nested_attributes_for :authentications
end
