class Project < ApplicationRecord
  validates :url, presence: true, format: { with: URI::regexp(%w[http https]) }
  validates :description, presence: true
  validates :technologies, presence: true
end
