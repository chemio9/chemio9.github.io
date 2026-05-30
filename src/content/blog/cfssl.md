---
title: Set up a private CA with `cfssl`
subtitle: Step by step tutorial
pubDate: 2026-05-30 22:05
tag:
  - PKI

---

## Why?

- Got a home lab and want to secure connections through https
- I hate openssl CLI, they're old and hard to use.
- I want a more modern solution.
- Just for fun :)

## Installing `cfssl`

```bash
git clone --depth=1 git@github.com:cloudflare/cfssl.git
cd cfssl
make
make install

# or
go install github.com/cloudflare/cfssl/cmd/...@latest
```

Make sure the binaries are in your `PATH` and let's get started.

## Generate root CA

```bash
mkdir pki/{ca,ocsp,crl,issued}
cd pki

cfssl print-defaults config > ca-config.json
```

and we get:

```json title="ca-config.json"
{
  "signing": {
    "default": {
      "expiry": "168h"
    },
    "profiles": {
      "www": {
        "expiry": "8760h",
        "usages": [
          "signing",
          "key encipherment",
          "server auth"
        ]
      },
      "client": {
        "expiry": "8760h",
        "usages": [
          "signing",
          "key encipherment",
          "client auth"
        ]
      }
    }
  }
}
```

The default value are pretty good, so we're not gonna change it.
However, the default value for CSR isn't what we desired, so let's customise it.

```jsonc title="csr-default.json"
{
  "CN": "",
  "hosts": [
    "example.net",
    "www.example.net"
  ],
  "key": {
    "algo": "ecdsa",
    "size": 256
  },
  "names": [
    {
      "C": "US",
      "ST": "CA",
      "L": "San Francisco"
    }
  ]
}
```

The default CSR uses ECDSA, which is [required by CABForum](https://cabforum.org/working-groups/server/baseline-requirements/requirements/#:~:text=No%20other%20algorithms%20or%20key%20sizes%20are%20permitted) to distribute keys with OSes or browsers:

> For RSA key pairs the CA SHALL:
>
> - Ensure that the modulus size, when encoded, is at least 2048 bits, and;
> - Ensure that the modulus size, in bits, is evenly divisible by 8.
>
> For ECDSA key pairs, the CA SHALL:
>
> - Ensure that the key represents a valid point on the NIST P-256, NIST P-384 or NIST P-521 elliptic curve.
>
> **No other algorithms or key sizes are permitted.**

Since no one will include our self-signed CA in their product, we'll just use Ed25519.

```bash
echo > ca-csr.json <EOF
{
    "CN": "Alkimia Root CA",
    "key": {
        "algo": "ed25519"
    },
    "names": [
        {
            "C": "CN",
            "ST": "GD",
            "L": "End City",
            "O": "Alkimia Org",
            "OU": "PKI"
        }
    ],
    "ca": {
        "expiry": "87600h"
    }
}
EOF
```

Now, generate the root CA.

```bash
cfssl gencert -initca ca-csr.json |cfssljson -bare ca
```

```json title="cfssl output"
{
  "cert": "-----BEGIN CERTIFICATE----....----END CERTIFICATE-----\n",
  "csr": "-----BEGIN CERTIFICATE REQUEST-----....-----END CERTIFICATE REQUEST-----\n",
  "key": "-----BEGIN Ed25519 PRIVATE KEY-----....-----END Ed25519 PRIVATE KEY-----\n"
}
```

`cfssljson` is responsible for saving it to files, in this case `ca-key.pem`, `ca.csr`and`ca.pem`.
`ca-key.pem` is our private key.

## Signing server certificates

```json title='server-csr.json'
{
  "CN": "alkimia.lan",
  "hosts": [
    "alkimia.lan",
    "*.alkimia.lan"
  ],
  "key": {
    "algo": "ed25519"
  },
  "names": [
    {
      "C": "CN",
      "ST": "GD",
      "L": "End City",
      "O": "Alkimia Org"
    }
  ]
}
```

```bash
cfssl gencert -ca ca.pem -ca-key ca-key.pem -config ca-config.json \
  -profile www server-csr.json \
 |cfssljson -bare issued/alkimia.lan
```

## Why don't we try CRL and OCSP?

Our CA is distributed by hand on every machine. CRL and OCSP are meaningless.
