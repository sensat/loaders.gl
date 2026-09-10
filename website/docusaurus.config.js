// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const webpack = require('webpack');
const {resolve} = require('path');
const {themes} = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'loaders.gl',
  tagline: 'A collection of loaders modules for Geospatial and 3D visualization use cases',
  url: 'https://loaders.gl',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  favicon: '/favicon.png',
  organizationName: 'visgl', // Usually your GitHub org/user name.
  projectName: 'loaders.gl', // Usually your repo name.
  trailingSlash: false,

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    }
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: '../docs',
          sidebarPath: resolve('./src/docs-sidebar.js'),
          // Point to to the website directory in your repo.
          editUrl: 'https://github.com/visgl/loaders.gl/tree/master/website'
        },
        theme: {
          customCss: [
            resolve('./src/styles.css')
            // resolve('./node_modules/maplibre-gl/dist/maplibre-gl.css')
          ]
        }
      })
    ]
  ],

  plugins: [
    [
      'docusaurus-node-polyfills', 
      { 
        excludeAliases: ['console']
      }
    ],
    require.resolve('./webpack-plugin'),
    [
      './ocular-docusaurus-plugin',
      {
        debug: true,
        resolve: {
          fallback: {path: false, fs: false, buffer: true},
          modules: [resolve('node_modules'), resolve('../node_modules')],
          alias: {
            examples: resolve('../examples'),

            '@sensat/loaders-gl-3d-tiles': resolve('../modules/3d-tiles/src'),
            '@sensat/loaders-gl-arrow': resolve('../modules/arrow/src'),
            '@sensat/loaders-gl-bson': resolve('../modules/bson/src'),
            '@sensat/loaders-gl-compression': resolve('../modules/compression/src'),
            '@sensat/loaders-gl-core': resolve('../modules/core/src'),
            '@sensat/loaders-gl-crypto': resolve('../modules/crypto/src'),
            '@sensat/loaders-gl-csv': resolve('../modules/csv/src'),
            '@sensat/loaders-gl-draco': resolve('../modules/draco/src'),
            '@sensat/loaders-gl-excel': resolve('../modules/excel/src'),
            '@sensat/loaders-gl-flatgeobuf': resolve('../modules/flatgeobuf/src'),
            '@sensat/loaders-gl-geopackage': resolve('../modules/geopackage/src'),
            '@sensat/loaders-gl-geotiff': resolve('../modules/geotiff/src'),
            '@sensat/loaders-gl-gis': resolve('../modules/gis/src'),
            '@sensat/loaders-gl-gltf': resolve('../modules/gltf/src'),
            '@sensat/loaders-gl-i3s': resolve('../modules/i3s/src'),
            '@sensat/loaders-gl-images': resolve('../modules/images/src'),
            '@sensat/loaders-gl-json': resolve('../modules/json/src'),
            '@sensat/loaders-gl-kml': resolve('../modules/kml/src'),
            '@sensat/loaders-gl-las': resolve('../modules/las/src'),
            '@sensat/loaders-gl-loader-utils': resolve('../modules/loader-utils/src'),
            '@sensat/loaders-gl-math': resolve('../modules/math/src'),
            '@sensat/loaders-gl-mlt': resolve('../modules/mlt/src'),
            '@sensat/loaders-gl-mvt': resolve('../modules/mvt/src'),
            '@sensat/loaders-gl-netcdf': resolve('../modules/netcdf/src'),
            '@sensat/loaders-gl-obj': resolve('../modules/obj/src'),
            '@sensat/loaders-gl-parquet': resolve('../modules/parquet/src'),
            '@sensat/loaders-gl-pcd': resolve('../modules/pcd/src'),
            '@sensat/loaders-gl-ply': resolve('../modules/ply/src'),
            '@sensat/loaders-gl-pmtiles': resolve('../modules/pmtiles/src'),
            '@sensat/loaders-gl-polyfills': resolve('../modules/polyfills/src'),
            '@sensat/loaders-gl-potree': resolve('../modules/potree/src'),
            '@sensat/loaders-gl-schema': resolve('../modules/schema/src'),
            '@sensat/loaders-gl-schema-utils': resolve('../modules/schema-utils/src'),
            '@sensat/loaders-gl-shapefile': resolve('../modules/shapefile/src'),
            '@loaders.gl/stac': resolve('../modules/stac/src'),
            '@sensat/loaders-gl-terrain': resolve('../modules/terrain/src'),
            '@sensat/loaders-gl-textures': resolve('../modules/textures/src'),
            '@sensat/loaders-gl-tile-converter': resolve('../apps/tile/converter/src-'),
            '@sensat/loaders-gl-tiles': resolve('../modules/tiles/src'),
            '@sensat/loaders-gl-tiles-2d': resolve('../modules/tiles-2d/src'),
            '@loaders.gl/type-analyzer': resolve('../modules/type-analyzer/src'),
            '@sensat/loaders-gl-video': resolve('../modules/video/src'),
            '@sensat/loaders-gl-wkt': resolve('../modules/wkt/src'),
            '@sensat/loaders-gl-wms': resolve('../modules/wms/src'),
            '@sensat/loaders-gl-worker-utils': resolve('../modules/worker-utils/src'),
            '@sensat/loaders-gl-xml': resolve('../modules/xml/src'),
            '@loaders.gl/zarr': resolve('../modules/zarr/src'),
            '@sensat/loaders-gl-zip': resolve('../modules/zip/src'),
            'sql.js': resolve('../node_modules/sql.js/dist/sql-wasm.js'),

            // '@deck.gl/react': resolve()
            // '@deck.gl/layers'
            // '@deck.gl/react'
            // '@deck.gl/layers'
            // '@deck.gl/react/typed'
            // '@deck.gl/layers/typed'
            // '@deck.gl/react'
            // '@deck.gl/geo-layers'
            // 'marked'
            // 'website-examples/i3s-arcgis/app'
            // 'website-examples/website/i3s/app'
            // '../react-table.css.js'
          }
        },
        plugins: [
          // new webpack.EnvironmentPlugin(['MapboxAccessToken', 'GoogleMapsAPIKey', 'GoogleMapsMapId']),
          // These modules break server side bundling
          new webpack.IgnorePlugin({
            resourceRegExp: /sql/
          })
        ],
        module: {
          rules: [
            // https://github.com/Esri/calcite-components/issues/2865
            {
              test: /\.m?js/,
              resolve: {
                fullySpecified: false
              }
            }
          ]
        }
      }
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'examples',
        path: './src/examples',
        routeBasePath: 'examples',
        sidebarPath: resolve('./src/examples-sidebar.js'),
        breadcrumbs: false,
        docItemComponent: resolve('./src/components/example/doc-item-component.tsx')
      }
    ],
    // [
    //   require.resolve('@cmfcmf/docusaurus-search-local'),
    //   {
    //     // Options here
    //   }
    // ],
    [
      '@docusaurus/plugin-client-redirects',
      {
        createRedirects(existingPath) {
          const pageRedirects = {
            '/examples/flatgeobuf': '/examples/geospatial/flatgeobuf',
            '/examples/geoarrow': '/examples/geospatial/geoarrow',
            '/examples/geoparquet': '/examples/geospatial/geoparquet',
            '/examples/geojson': '/examples/geospatial/geojson',
    
            '/examples/pmtiles': '/examples/tiles/pmtiles',
            '/examples/wms': '/examples/tiles/wms',
          };
          for (const [oldLink, newLink] of Object.entries(pageRedirects)) {
            if (existingPath.includes(oldLink)) {
              return existingPath.replace(oldLink, newLink);
            }
          }
          if (pageRedirects[existingPath]) {
            return [pageRedirects[existingPath]];
          }
          // docs/modules/*/api-reference <= modules/*/docs/api-reference
          if (existingPath.includes('/docs/modules/')) {
            return [
              existingPath
                .replace('/docs/modules/', '/modules/')
                // Replaces api-reference if present
                .replace('/api-reference/', '/docs/api-reference/')
            ];
          }
          return undefined; // Return a falsy value: no redirect created
        }
      }
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'loaders.gl',
        logo: {
          alt: 'vis.gl Logo',
          src: 'images/visgl-logo-dark.png'
        },
        items: [
          {
            to: '/docs',
            position: 'left',
            label: 'Docs'
          },
          {
            to: '/examples',
            position: 'left',
            label: 'Examples'
          },
          {
            to: '/showcase',
            position: 'left',
            label: 'Showcases',
          },
          {
            to: 'https://medium.com/vis-gl',
            label: 'Blog',
            position: 'left'
          },
          {
            type: 'html',
            position: 'right',
            value: '<a href="https://openvisualization.org" target="_blank" style="content: \'\'; height: 80px; width: 100px; margin-top: -30px; background-image: url(\'/images/openjs-foundation.svg\'); background-repeat: no-repeat;  background-size: 80px 110px; display: flex">'
          },
          {
            href: 'https://github.com/visgl/loaders.gl',
            label: 'GitHub',
            position: 'right'
          }
        ]
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Other vis.gl Libraries',
            items: [
              {
                label: 'vis.gl',
                href: 'https://vis.gl'
              },
              {
                label: 'deck.gl',
                href: 'https://deck.gl'
              },
              {
                label: 'luma.gl',
                href: 'https://luma.gl'
              },
              {
                label: 'math.gl',
                href: 'https://math.gl'
              }
            ]
          },
          {
            title: 'More',
            items: [
              {
                label: 'Open Visualization',
                href: 'https://www.openvisualization.org/'
              },
              {
                label: 'deck.gl slack',
                href: 'https://join.slack.com/t/deckgl/shared_invite/zt-7oeoqie8-NQqzSp5SLTFMDeNSPxi7eg'
              },
              {
                label: 'vis.gl blog on Medium',
                href: 'https://medium.com/vis-gl'
              },
              {
                label: 'GitHub',
                href: 'https://github.com/visgl/loaders.gl'
              }
            ]
          }
        ],
        copyright: `Copyright © ${new Date().getFullYear()} OpenJS Foundation`
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
      }
    })
};

module.exports = config;
