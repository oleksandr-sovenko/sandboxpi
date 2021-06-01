{
  "targets": [
    {
        "target_name": "sandboxpi",
        "libraries": [ "-lwiringPi", "-lpthread" ],
        "cflags!": [ "-fno-exceptions" ],
        "cflags_cc!": [ "-fno-exceptions" ],
        "sources": [ "src/main.cc", "src/bmp280/bmp280.cpp" ],
        "include_dirs": [
            "<!@(node -p \"require('node-addon-api').include\")"
        ],
        'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
    }
  ]
}
