### Setup GeoServer on Ubuntu

- Download the "Platform Independent Binary" at https://geoserver.org/release/stable/
- Enable Apache modules
  - `a2enmod ssl`
  - `a2enmod headers`
  - `a2enmod proxy_http`
- Apache conf
  ```
  <VirtualHost *:80>
    ServerName  geoserver.gplates.org
    ServerAdmin michael.chin@sydney.edu.au

    RewriteEngine on
    RewriteCond %{SERVER_NAME} =geoserver.gplates.org
    RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]
  </VirtualHost>
  ```
  ```
  <IfModule mod_ssl.c>
    <VirtualHost *:443>
        ServerAdmin michael.chin@sydney.edu.au
        ServerName geoserver.gplates.org
    
        ErrorLog ${APACHE_LOG_DIR}/geoserver_error.log
        CustomLog ${APACHE_LOG_DIR}/geoserver_access.log combined
    
    
        SSLEngine on
        SSLProxyEngine on
    
        ProxyPass /geoserver/ http://localhost:8080/geoserver/
        ProxyPassReverse /geoserver/ http://localhost:8080/geoserver/
    
        ProxyPreserveHost On
        ProxyRequests Off
        #sudo a2enmod headers
        RequestHeader set X-Forwarded-Proto "https"
    
        Include /etc/letsencrypt/options-ssl-apache.conf
        SSLCertificateFile /etc/letsencrypt/live/geoserver.gplates.org/fullchain.pem
        SSLCertificateKeyFile /etc/letsencrypt/live/geoserver.gplates.org/privkey.pem
    </VirtualHost>
  </IfModule>
  ```
  Use `apache2ctl configtest` to check Apache configuration.

- Edit data_dir/global.xml
  ```
  <proxyBaseUrl>https://geoserver.gplates.org/geoserver</proxyBaseUrl>
  <useHeadersProxyURL>true</useHeadersProxyURL>
  ```
- Edit /opt/geoserver/webapps/geoserver/WEB-INF/web.xml
  ```
  <context-param>
      <param-name>GEOSERVER_CSRF_WHITELIST</param-name>
      <param-value>localhost:8100,geoserver.gplates.org</param-value>
  </context-param>

  <filter>
    <filter-name>cross-origin</filter-name>
    <filter-class>org.eclipse.jetty.servlets.CrossOriginFilter</filter-class>
    <init-param>
      <param-name>chainPreflight</param-name>
      <param-value>false</param-value>
    </init-param>
    <init-param>
      <param-name>allowedOrigins</param-name>
      <param-value>*</param-value>
    </init-param>
    <init-param>
      <param-name>allowedMethods</param-name>
      <param-value>GET,POST,PUT,DELETE,HEAD,OPTIONS</param-value>
    </init-param>
    <init-param>
      <param-name>allowedHeaders</param-name>
      <param-value>*</param-value>
    </init-param>
  </filter>

  <filter-mapping>
      <filter-name>cross-origin</filter-name>
      <url-pattern>/*</url-pattern>
  </filter-mapping>

  ```

### Install plugin

- download zip file from https://sourceforge.net/projects/geoserver/files/GeoServer/2.23.2/extensions/
- unzip to /opt/geoserver/webapps/geoserver/WEB-INF/lib (you only need to .jar files)

### Plugins

- netcdf
- css style
  
### Notes

- The default usename and password is admin and geoserver. You need to use port 8080 to login before setting up proxy properly.
- Python scripts to manage GeoServer are at https://github.com/michaelchin/geoserver-pyadm.
- NetCDF files need georeferencing before uploading into GeoServer `gdal_translate -of NetCDF -a_ullr -180 90 180 -90 old.nc georeferenced.nc`.
- You need to install netcdf plugin to use netcdf grids.
  
