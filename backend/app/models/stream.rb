class Stream < ApplicationRecord
  def tags
    super || []
  end
end
