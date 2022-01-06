# ISCN_writer

## Purpose

+ writes FISH ISCN for two-color breakapart and dual fusion probes
+ handles ranges separated by tilde (~) or dash (-); e.g. 2\~3 or 2-3
+ handles inequalties in probe signal counts expressed as >, >=, or =>; e.g., >=2R>3G
+ expected form for breakapart:  5\' or 3\' signal before probe name; e.g., 3'IGH
+ conforms to ISCN (2020)
+ writes up to three clones in descending order
