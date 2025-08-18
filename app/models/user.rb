class User < ApplicationRecord
  # OAuth authentication with Sorcery
  authenticates_with_sorcery!
  
  # Associations
  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :authentications, dependent: :destroy
  accepts_nested_attributes_for :authentications
  
  # Validations
  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates :name, presence: true
  
  # Callbacks
  before_save :downcase_email
  before_create :generate_api_token
  
  # API Token methods
  def regenerate_api_token!
    self.api_token = generate_token
    save!
  end
  
  def self.find_by_api_token(token)
    find_by(api_token: token) if token.present?
  end
  
  private
  
  def downcase_email
    self.email = email.downcase if email.present?
  end
  
  def generate_api_token
    self.api_token = generate_token
  end
  
  def generate_token
    loop do
      token = SecureRandom.urlsafe_base64(32)
      break token unless User.exists?(api_token: token)
    end
  end
end
