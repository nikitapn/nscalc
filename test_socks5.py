#!/usr/bin/env python3
"""
Simple test script to verify SOCKS5 proxy functionality
"""

import socket
import struct
import time

def test_socks5_proxy():
    """Test basic SOCKS5 connection through our proxy"""
    try:
        # Connect to our SOCKS5 proxy on port 1080
        proxy_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        proxy_socket.connect(('127.0.0.1', 1080))
        print("✓ Connected to SOCKS5 proxy on port 1080")
        
        # Send SOCKS5 authentication request (version 5, 1 method, no auth)
        auth_request = struct.pack('BBB', 0x05, 0x01, 0x00)
        proxy_socket.send(auth_request)
        print("✓ Sent authentication request")
        
        # Receive authentication response
        auth_response = proxy_socket.recv(2)
        if len(auth_response) == 2 and auth_response[0] == 0x05 and auth_response[1] == 0x00:
            print("✓ Authentication successful (NO_AUTH)")
        else:
            print("✗ Authentication failed")
            return False
        
        # Send CONNECT request to example.com:80
        target_host = "example.com"
        target_port = 80
        
        # Build CONNECT request: VER CMD RSV ATYP DST.ADDR DST.PORT
        connect_request = struct.pack('BBB', 0x05, 0x01, 0x00)  # VER CMD RSV
        connect_request += struct.pack('B', 0x03)  # ATYP = domain name
        connect_request += struct.pack('B', len(target_host))  # domain length
        connect_request += target_host.encode('ascii')  # domain
        connect_request += struct.pack('!H', target_port)  # port (big-endian)
        
        proxy_socket.send(connect_request)
        print(f"✓ Sent CONNECT request to {target_host}:{target_port}")
        
        # Receive CONNECT response
        connect_response = proxy_socket.recv(10)
        if len(connect_response) >= 2 and connect_response[0] == 0x05:
            if connect_response[1] == 0x00:
                print("✓ CONNECT successful")
                
                # Send a simple HTTP request
                http_request = f"GET / HTTP/1.1\r\nHost: {target_host}\r\nConnection: close\r\n\r\n"
                proxy_socket.send(http_request.encode())
                print("✓ Sent HTTP request through proxy")
                
                # Receive HTTP response
                response = proxy_socket.recv(1024)
                if b"HTTP/" in response:
                    print("✓ Received HTTP response through proxy")
                    print("✓ SOCKS5 proxy test PASSED!")
                    return True
                else:
                    print("✗ No valid HTTP response received")
            else:
                print(f"✗ CONNECT failed with code: {connect_response[1]}")
        else:
            print("✗ Invalid CONNECT response")
        
        proxy_socket.close()
        return False
        
    except Exception as e:
        print(f"✗ Test failed with exception: {e}")
        return False

if __name__ == "__main__":
    print("Testing SOCKS5 proxy functionality...")
    print("Note: This test requires the nscalc server and proxy_client to be running")
    print()
    
    # Give some time for connections to be established
    time.sleep(1)
    
    success = test_socks5_proxy()
    if success:
        print("\n🎉 SOCKS5 proxy is working correctly!")
    else:
        print("\n❌ SOCKS5 proxy test failed")
