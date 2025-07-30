FROM ruby:3.2.3-slim

RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
    nodejs \
    default-mysql-client \
    libmariadb-dev-compat \
    build-essential \
    libpq-dev \
    libxml2-dev \
    libxslt1-dev \
    git \
    curl \
    cron && \
    rm -rf /var/lib/apt/lists/*

ENV RAILS_ENV=production

WORKDIR /app

COPY Gemfile Gemfile.lock ./
RUN gem install bundler && \
    bundle config set without 'development test' && \
    bundle install

COPY . .

EXPOSE 3000
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
