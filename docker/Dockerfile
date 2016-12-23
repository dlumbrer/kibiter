FROM debian:stable

MAINTAINER David Pose <dpose@bitergia.com>, Alvaro del Castillo <acs@bitergia.com>, David Muriel <dmuriel@bitergia.com>
# Image for developing Kibiter/Kibana

# ENV KIBANA_BRANCH master
ENV KIBANA_BRANCH 5.1.1

# add our user and group first to make sure their IDs get assigned consistently
RUN groupadd --system kibana && \
    useradd --system --create-home --gid kibana kibana

# backports used to install java 8 needed by elasticsearch 5
# ruby gems are used for building binary packages
RUN echo "deb http://ftp.debian.org/debian jessie-backports main" >> /etc/apt/sources.list.d/backports.list && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
            ca-certificates \
            curl \
            wget \
            git \
            python \
            zip \
            make \
            g++ \
            openjdk-8-jre \
            ruby-dev rpm rubygems \
            && \
    rm /etc/apt/sources.list.d/backports.list && \
    apt-get update && \
    # install nvm
    curl -o /tmp/nvm-install.sh -sSL https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh && \
    chmod +x /tmp/nvm-install.sh && \
    bash -c /tmp/nvm-install.sh && \
    . /root/.bashrc && \

    # install kibiter
    # gems needed in Kibana > 5.x to build binary packages
    gem install fpm -v 1.5.0 && \
    gem install pleaserun -v 0.0.24 && \
    git clone --depth 1 --branch ${KIBANA_BRANCH} https://github.com/grimoirelab/kibiter.git && \
    cd kibiter && \
    nvm install "$( cat .node-version )" && \
    npm install -g grunt-cli && \
    npm install && \
    sed -e "/return \[/,/\].map/ {/\(windows\|darwin\|x86\)/ d;s/,//g}" -i tasks/config/platforms.js && \
    grunt --no-color _build:downloadNodeBuilds:start _build:downloadNodeBuilds:finish && \
    grunt --no-color build && \
    tar xfz target/kibana-*-linux-x86_64.tar.gz --directory /opt && \
    mv /opt/kibana-*-linux-x86_64* /opt/kibana && \
    cd /root && \
    chown -R kibana:kibana /opt/kibana  && \

    # cleanup to thin the final image
    apt-get clean

# grab gosu for easy step-down from root
RUN gpg --keyserver ha.pool.sks-keyservers.net --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4
RUN arch="$(dpkg --print-architecture)" \
	&& set -x \
	&& curl -o /usr/local/bin/gosu -sSL "https://github.com/tianon/gosu/releases/download/1.3/gosu-$arch" \
	&& curl -o /usr/local/bin/gosu.asc -sSL "https://github.com/tianon/gosu/releases/download/1.3/gosu-$arch.asc" \
	&& gpg --verify /usr/local/bin/gosu.asc \
	&& rm /usr/local/bin/gosu.asc \
	&& chmod +x /usr/local/bin/gosu

ENV PATH /opt/kibana/bin:$PATH

# Remove kibana optimize so it is regenerated when we modify src files in containers
RUN rm -rf /opt/kibana/optimize/*

COPY ./docker-entrypoint.sh /

EXPOSE 5601
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["kibana"]
