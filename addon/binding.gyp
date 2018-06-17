{
    "targets": [
        {
            "target_name": "addon",
            "sources": [
                "addon.cpp",
                "utils.cpp",
                "worker.cpp"
            ],
            "include_dirs" : [
                "<!(node -e \"require('nan')\")"
            ],
            "cflags": ["-Wall", "-std=c++14"],
        }
    ]
}