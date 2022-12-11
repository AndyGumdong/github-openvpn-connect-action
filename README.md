# github-openvpn-connect-action

GitHub Action for connecting to OpenVPN server.

## Inputs

### General Inputs

| Name | Description | Required |
| --- | --- | --- | 
| `config_file` | Location of OpenVPN client config file | yes |

```yaml
      - name: Checkout
        uses: actions/checkout@v3
      - name: Install OpenVPN
        run: |
          sudo apt update
          sudo apt install -y openvpn openvpn-systemd-resolved
      - name: Connect to VPN
        uses: "uzaysan/github-openvpn-connect-action@0.0.1"
        with:
          config: ${{ secrets.OVPN_CONFIG_CONTENT }}
      - name: Build something
        run: ./gradlew clean build
      # The openvpn process is automatically terminated in post-action phase
```

## License

[MIT](LICENSE)
