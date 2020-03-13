#!/bin/bash

set -e

# Add kibana as command if needed
if [[ "$1" == -* ]]; then
	set -- kibana "$@"
fi

# Run as user "kibana" if the command is "kibana"
if [ "$1" = 'kibana' ]; then
	if [ "$ELASTICSEARCH_URL" -o "$ELASTICSEARCH_PORT_9200_TCP" ]; then
		: ${ELASTICSEARCH_URL:='http://elasticsearch:9200'}
		sed -ri "s!^(\#\s*)?(elasticsearch\.url:).*!\2 '$ELASTICSEARCH_URL'!" /opt/kibana/config/kibana.yml
	else
		echo >&2 'warning: missing ELASTICSEARCH_PORT_9200_TCP or ELASTICSEARCH_URL'
		echo >&2 '  Did you forget to --link some-elasticsearch:elasticsearch'
		echo >&2 '  or -e ELASTICSEARCH_URL=http://some-elasticsearch:9200 ?'
		echo >&2
	fi
    sed -e "s|^#server.host: .*$|server.host: 0.0.0.0|" -i /opt/kibana/config/kibana.yml

    if [ "$BASE_PATH" != "" ]; then
        sed -e "s|^#server.basePath: \"\".*$|server.basePath: \"$BASE_PATH\"|" -i /opt/kibana/config/kibana.yml
    fi

    if [ "$PROJECT_NAME" != "" ]; then
        sed -e "s/title: 'Kibana',$/title: '$PROJECT_NAME',/" -i /opt/kibana/src/core_plugins/kibana/index.js
        sed -e "s|__PROJECT__|$PROJECT_NAME|" -i /opt/kibana/src/ui/views/chrome.jade
    fi

    if [ "$ELASTICSEARCH_USER" != "" -a "$ELASTICSEARCH_PASSWORD" != "" ]; then
        sed -e "s|^#elasticsearch.username:.*$|elasticsearch.username: \"$ELASTICSEARCH_USER\"|" -i /opt/kibana/config/kibana.yml
        sed -e "s|^#elasticsearch.password:.*$|elasticsearch.password: \"$ELASTICSEARCH_PASSWORD\"|" -i /opt/kibana/config/kibana.yml
	else
        echo >&2 'error: ELASTICSEARCH_USER or/and ELASTICSEARCH_PASSWORD environment variables were not configured'
        echo >&2 '  these two docker environment variables must be configured before running the container'
        exit 1
    fi

    if [ "$ANONYMOUS_USER" != "" ]; then
        echo 'searchguard.auth.anonymous_auth_enabled: true' >> /opt/kibana/config/kibana.yml
    fi

    if [ "$SUPPORT_ADDRESS" != "" ]; then
        sed -e "s|^#searchguard.basicauth.login.contact_email:.*$|searchguard.basicauth.login.contact_email: \"$SUPPORT_ADDRESS\"|" -i /opt/kibana/config/kibana.yml
    fi

	set -- gosu kibana "$@"
fi

exec "$@"
