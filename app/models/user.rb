class User < ApplicationRecord
  # OAuth authentication with Sorcery
  authenticates_with_sorcery!
  
  # Associations
  has_many :posts, dependent: :destroy
  has_many :authentications, dependent: :destroy
  accepts_nested_attributes_for :authentications
  
  # Validations
  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates :name, presence: true
  
  # Callbacks
  before_save :downcase_email
  
  private
  
  def downcase_email
    self.email = email.downcase if email.present?
  end
end
