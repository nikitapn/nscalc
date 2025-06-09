# Windows Certificate Setup for Self-Signed SSL Testing

This guide explains how to add your self-signed certificate for `archvm.lan` to Chrome browser on Windows for testing the NSCalc application with HTTPS.

## Prerequisites

- Your self-signed certificate file: `certs/archvm.lan.crt`
- Windows machine with Chrome browser
- Administrator privileges (recommended for some methods)

## Method 1: Using Chrome Settings (Recommended)

1. **Open Chrome Settings**:
   - Type `chrome://settings/` in the address bar
   - Or click the three dots menu → Settings

2. **Navigate to Security Settings**:
   - Click "Privacy and security" in the left sidebar
   - Click "Security"

3. **Manage Certificates**:
   - Scroll down and click "Manage certificates"
   - This opens the Windows Certificate Manager

4. **Import Certificate**:
   - Go to the "Trusted Root Certification Authorities" tab
   - Click "Import..."
   - Click "Next" in the Certificate Import Wizard
   - Browse and select your `archvm.lan.crt` file
   - Click "Next"
   - Select "Place all certificates in the following store" and ensure "Trusted Root Certification Authorities" is selected
   - Click "Next" → "Finish"
   - Click "Yes" when prompted with security warning

## Method 2: Using Windows Certificate Manager Directly

1. **Open Certificate Manager**:
   - Press `Win + R`
   - Type `certmgr.msc` and press Enter

2. **Import Certificate**:
   - Expand "Trusted Root Certification Authorities"
   - Right-click on "Certificates"
   - Select "All Tasks" → "Import..."
   - Follow the wizard to import your `archvm.lan.crt` file

## Method 3: Using Command Line (PowerShell as Administrator)

```powershell
# Import certificate to Trusted Root store
Import-Certificate -FilePath "C:\path\to\your\archvm.lan.crt" -CertStoreLocation Cert:\LocalMachine\Root
```

## Method 4: Double-click Installation

1. **Simple Installation**:
   - Copy your `archvm.lan.crt` file to your Windows machine
   - Double-click the certificate file
   - Click "Install Certificate..."
   - Choose "Local Machine" (requires admin) or "Current User"
   - Select "Place all certificates in the following store"
   - Browse and select "Trusted Root Certification Authorities"
   - Click "Next" → "Finish"

## Additional Configuration

### 1. Windows Hosts File Configuration

Since you're using `archvm.lan` as hostname, you need to add an entry to your Windows hosts file:

1. Open Notepad as Administrator
2. Open file: `C:\Windows\System32\drivers\etc\hosts`
3. Add this line (replace with your actual server IP):
   ```
   192.168.x.x archvm.lan
   ```
4. Save the file

### 2. Certificate Requirements

Ensure your certificate meets these requirements:
- **Common Name (CN)** or **Subject Alternative Name (SAN)** must match exactly `archvm.lan`
- Certificate must not be expired
- Certificate format should be `.crt`, `.cer`, or `.pem`

## Verification Steps

1. **Restart Chrome** completely after installing the certificate
2. Visit `https://archvm.lan:8080` in Chrome
3. You should see a secure connection (green lock icon) instead of certificate warnings
4. Verify installation by going to `chrome://settings/certificates` and checking the "Trusted Root Certification Authorities" tab

## Troubleshooting

### Certificate Still Shows as Untrusted

- **Clear Chrome cache**: `chrome://settings/clearBrowserData`
- **Restart Chrome** completely
- **Check hostname**: Make sure you're accessing `https://archvm.lan:8080`, not `https://localhost:8080` or IP address
- **Verify certificate CN/SAN**: The certificate must be issued for exactly `archvm.lan`

### Certificate Import Failed

- **Check file format**: Ensure the certificate is in `.crt`, `.cer`, or `.pem` format
- **Run as Administrator**: Some import methods require admin privileges
- **Check certificate validity**: Ensure the certificate hasn't expired

### Connection Still Fails

- **Firewall**: Check Windows Firewall isn't blocking the connection
- **Network**: Verify you can reach the server (ping archvm.lan)
- **Server running**: Ensure the NSCalc server is running with SSL enabled

## Security Notes

⚠️ **Important Security Considerations**:

1. **Development Only**: Only install self-signed certificates for development/testing purposes
2. **Remove After Testing**: Remove the certificate from trusted store when done testing
3. **Network Security**: Self-signed certificates don't provide the same security guarantees as CA-signed certificates
4. **Limited Scope**: Only install certificates you trust and control

## NSCalc Server Configuration

Make sure your NSCalc server is configured correctly:

```bash
# From the run.sh script
.build_local/debug/nscalc \
    --hostname archvm.lan \
    --http-dir ./client/public \
    --data-dir ./sample_data \
    --use-ssl 1 \
    --public-key  certs/archvm.lan.crt \
    --private-key certs/archvm.lan.key \
    --dh-params   certs/dhparam.pem
```

## Certificate Removal

To remove the certificate when testing is complete:

1. Open Certificate Manager (`certmgr.msc`)
2. Navigate to "Trusted Root Certification Authorities" → "Certificates"
3. Find your `archvm.lan` certificate
4. Right-click and select "Delete"
5. Restart Chrome

## Additional Resources

- [Chrome Certificate Management](https://support.google.com/chrome/a/answer/6342302)
- [Windows Certificate Manager](https://docs.microsoft.com/en-us/dotnet/framework/wcf/feature-details/how-to-view-certificates-with-the-mmc-snap-in)
- [SSL Certificate Troubleshooting](https://support.google.com/chrome/answer/95617)

---

**Last Updated**: June 2025  
**For NSCalc Project**: Development and Testing Setup
