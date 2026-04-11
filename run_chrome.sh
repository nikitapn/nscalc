#!/bin/bash

SCRIPT_DIR=$(dirname "$(readlink -e "${BASH_SOURCE[0]}")")
CHROMIUM_BIN="/usr/bin/chromium"
HOST="localhost:8443"
CERTIFICATE_PATH="$SCRIPT_DIR/certs/out/localhost.crt"

CERTIFICATE_SPKI=$(node <<EOF
import fs from 'fs';
import path from 'path';
import { createHash, X509Certificate } from 'crypto';

function getServerCertificateSpki(certPath: string): string {
  const certificate = new X509Certificate(fs.readFileSync(certPath));
  const spki = certificate.publicKey.export({
    type: 'spki',
    format: 'der',
  });

  return createHash('sha256').update(spki).digest('base64');
}

const certificateSpki = getServerCertificateSpki("$CERTIFICATE_PATH");
console.log(certificateSpki);
EOF
)

echo "Certificate SPKI: $CERTIFICATE_SPKI"

CMD=(
  --user-data-dir=$SCRIPT_DIR/.chromium-data
  --enable-quic
  --ignore-certificate-errors
  --ignore-certificate-errors-spki-list=${CERTIFICATE_SPKI}
  # This is needed not to force Chromium to use h3 as name suggests
  # but to overcome WebTransport certificate errors
  --origin-to-force-quic-on=$HOST
)

# Run Chromium with the specified command-line arguments
$CHROMIUM_BIN "${CMD[@]}" "https://$HOST" > /dev/null 2>&1 &