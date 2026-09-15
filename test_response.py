# Let us inspect lines 0x99b450 to 0x99b500 where HTTP headers are written:
# 0x99b487: attachment; filename=%q
# 0x99b4b9: Content-Disposition
# 0x99b2c5: Content-Type: application/gzip
#
# Then what writes the body of the HTTP response?
# In fsArchiveBuildArtifactHandler:
# w is http.ResponseWriter
# It creates gzip.NewWriter(w)
# Then tar.NewWriter(gzipWriter)
# Then it passes tarWriter to the archiving closure!
# Then gzipWriter.Close(), tarWriter.Close()
