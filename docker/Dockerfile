FROM debian:stable

MAINTAINER David Pose <dpose@bitergia.com>, Alvaro del Castillo <acs@bitergia.com>

ENV KIBANA_BRANCH integration-4.4.1

# add our user and group first to make sure their IDs get assigned consistently
RUN groupadd -r kibana && useradd -r -m -g kibana kibana

RUN apt-get update && apt-get install -y \
    ca-certificates curl wget \
    git python zip make g++ \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*

# grab gosu for easy step-down from root
RUN gpg --keyserver ha.pool.sks-keyservers.net --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4
RUN arch="$(dpkg --print-architecture)" \
	&& set -x \
	&& curl -o /usr/local/bin/gosu -SL "https://github.com/tianon/gosu/releases/download/1.3/gosu-$arch" \
	&& curl -o /usr/local/bin/gosu.asc -SL "https://github.com/tianon/gosu/releases/download/1.3/gosu-$arch.asc" \
	&& gpg --verify /usr/local/bin/gosu.asc \
	&& rm /usr/local/bin/gosu.asc \
	&& chmod +x /usr/local/bin/gosu

# Build the release tarball from sources

ENV NODE_VERSION "4.3.0"
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
RUN git clone https://github.com/grimoirelab/kibiter.git && cd kibiter && git checkout ${KIBANA_BRANCH}
# RUN . /root/.bashrc && cd kibiter && nvm install "$(cat .node-version)" && \
RUN . /root/.bashrc && cd kibiter && nvm install "${NODE_VERSION}" && \
    npm install -g grunt-cli && npm install && \
    grunt --no-color _build:downloadNodeBuilds:start _build:downloadNodeBuilds:finish && \
    grunt --no-color build && \
    tar xfz target/kibana-4.*-linux-x64.tar.gz --directory /opt && mv /opt/* /opt/kibana && \
    rm -rf /kibiter

ADD kibana.yml /opt/kibana/config/kibana.yml
ADD kibana.yml /opt/kibana/src/config/kibana.yml
RUN chown -R kibana:kibana /opt/kibana

ENV PATH /opt/kibana/bin:$PATH

COPY ./docker-entrypoint.sh /

EXPOSE 5601
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["kibana"]
