# Spruce Irrigation HomeBridge plugin
[![verified-by-homebridge](https://badgen.net/badge/homebridge/verified/purple)](https://github.com/homebridge/homebridge/wiki/Verified-Plugins)
## Introduction

This plugin is meant to connect your Spruce Irrigation Controller
to HomeBridge so you can add it to HomeKit.

## Configuration

You will need to select the *Polling Interval* (this is how often the
app will poll the Spruce API to update the device status) which is
measured in seconds. The value must be between 10 and 600.

The *Valve Run Shutoff Timer* is the number of minutes to leave the
valve on when you activate a zone. When you turn on a valve, it will
turn off automatically after this amount of time. Must be between 1 and 60.

You will also need a *Spruce Account Access Token*. Spruce is working
on a way to get this from the account page, but if you don't see it
there, it may not be complete yet, so for now you can
email support and ask them to manually create a token. This token
grants access to your account, so do not share it or post it anywhere.

# Donations

If you find this useful and have a few extra bucks lying around,
you can send a donation with [PayPal](https://www.paypal.com/paypalme/waltmoorhouse) or
[venmo](https://venmo.com/?txn=pay&audience=public&recipients=Walt-Moorhouse),
so I can buy more IoT devices.  :-)
