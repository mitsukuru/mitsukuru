class AddOnboardingFieldsToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :onboarding_completed, :boolean, default: false
    add_column :users, :first_login_at, :datetime
  end
end
