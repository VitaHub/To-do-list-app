source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

gem 'rails',                    '~> 5.0.1'
gem 'pg',                       '~> 0.18'
gem 'puma',                     '~> 3.0'
gem 'sass-rails',               '~> 5.0'
gem 'uglifier',                 '>= 1.3.0'
gem 'coffee-rails',             '~> 4.2'
gem 'jquery-rails'
gem 'jbuilder',                 '~> 2.5'
gem 'webpack-rails'
gem 'foreman'
gem 'devise'
gem 'omniauth-vkontakte'
gem 'angular_rails_csrf'
gem 'active_model_serializers', '~> 0.10.0'
gem 'acts_as_list'

group :test do
  gem 'shoulda-matchers',       '~> 3.1'
end

group :development, :test do
  gem 'byebug', platform: :mri
  gem 'dotenv-rails'
  gem 'rspec-rails',            '~> 3.5'
  gem 'rails-controller-testing'
  gem 'factory_girl_rails'
end

group :development do
  gem 'web-console',            '>= 3.3.0'
  gem 'listen',                 '~> 3.0.5'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]

