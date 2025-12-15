import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { askLLM, ChatMessage as LLMChatMessage } from '../services/llm';
import { Paperclip, Mic, Send } from 'lucide-react';

const MODULES = [
  {
    id: 'module-1',
    title: 'Networking – Intermediate',
    topics: [
      {
        id: 'intro',
        title: 'Topic 1: Introduction to Linux Networking',
        theoryPages: [
          `
          <div>
            <h2 class="text-xl font-semibold mb-3">Overview</h2>
            <p class="mb-3">Linux networking is built on a modular, layered architecture where the kernel handles:</p>
            <ul class="list-disc ml-6 mb-3">
              <li>Network interface drivers</li>
              <li>Routing logic</li>
              <li>Packet forwarding</li>
              <li>Firewall/NAT operations</li>
              <li>Socket communication</li>
              <li>Transport protocol stacks</li>
            </ul>
            <p class="mb-3">User‑space tools (<code>ip</code>, <code>ss</code>, <code>tcpdump</code>, <code>systemd-networkd</code>, <code>NetworkManager</code>) interface with the kernel through <strong>netlink</strong> sockets.</p>
            <p class="mb-3">Linux is widely used in routers/firewalls, cloud instances, containers/Kubernetes, servers, and IoT/embedded devices. Understanding Linux networking is foundational for security, DevOps, and system administration.</p>

            <hr class="my-4 border-white/10" />
            <h2 class="text-xl font-semibold mb-3">Kernel Networking Stack Architecture</h2>
            <div class="space-y-3">
              <div>
                <p class="font-medium mb-1">Link Layer (Layer 2)</p>
                <ul class="list-disc ml-6">
                  <li>Ethernet, 802.1Q VLANs, bonding, bridging</li>
                  <li>MAC addresses</li>
                  <li>ARP (Address Resolution Protocol)</li>
                </ul>
              </div>
              <div>
                <p class="font-medium mb-1">Network Layer (Layer 3)</p>
                <ul class="list-disc ml-6">
                  <li>IPv4 & IPv6 routing</li>
                  <li>IP addressing</li>
                  <li>ICMP</li>
                  <li>Tunnels (GRE, IPIP, WireGuard, IPSec)</li>
                </ul>
              </div>
              <div>
                <p class="font-medium mb-1">Transport Layer (Layer 4)</p>
                <ul class="list-disc ml-6">
                  <li>TCP, UDP, SCTP</li>
                  <li>Socket communication</li>
                  <li>Connection management</li>
                </ul>
              </div>
              <div>
                <p class="font-medium mb-1">Application Layer</p>
                <ul class="list-disc ml-6">
                  <li>Daemons: <code>sshd</code>, <code>nginx</code>, <code>dhcpd</code>, <code>named</code></li>
                  <li>User tools: <code>curl</code>, <code>wget</code>, <code>ping</code></li>
                </ul>
              </div>
            </div>
          </div>
          `,
          `
          <div>
            <h2 class="text-xl font-semibold mb-3">Key Kernel Features</h2>
            <h3 class="text-lg font-semibold mb-2">Packet Forwarding</h3>
            <p class="mb-2">Linux can act as a router:</p>
            <pre class="bg-black/60 text-white rounded-md p-3 overflow-auto text-sm"><code>/proc/sys/net/ipv4/ip_forward = 1</code></pre>
            <h3 class="text-lg font-semibold mt-4 mb-2">Netfilter / iptables / nftables</h3>
            <p class="mb-2">Kernel firewall/NAT framework for packet filtering, NAT, and state tracking.</p>
            <h3 class="text-lg font-semibold mt-4 mb-2">qdisc & Traffic Control</h3>
            <p class="mb-2">Handles packet scheduling, shaping, and QoS.</p>
            <h3 class="text-lg font-semibold mt-4 mb-2">Neighbor Tables</h3>
            <p class="mb-2">Stores ARP (IPv4) and NDP (IPv6) entries.</p>

            <hr class="my-4 border-white/10" />
            <h2 class="text-xl font-semibold mb-3">User Space Tools and Their Roles</h2>
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <p class="font-medium mb-1">Old Tools</p>
                <ul class="list-disc ml-6">
                  <li><code>ifconfig</code>, <code>route</code>, <code>netstat</code></li>
                  <li>Deprecated and limited functionality</li>
                </ul>
              </div>
              <div>
                <p class="font-medium mb-1">Modern Tools (iproute2)</p>
                <ul class="list-disc ml-6">
                  <li><code>ip</code> — interface, link, address, routing</li>
                  <li><code>ss</code> — advanced socket statistics</li>
                  <li><code>tc</code> — traffic control</li>
                  <li><code>bridge</code> — bridge/STP management</li>
                  <li><code>rtmon</code> — monitor netlink changes</li>
                </ul>
                <p class="mt-2">Used across modern Linux distributions.</p>
              </div>
            </div>
          </div>
          `,
          `
          <div>
            <h2 class="text-xl font-semibold mb-3">Networking in Cloud & Containers</h2>
            <ul class="list-disc ml-6 mb-3">
              <li>Docker virtual Ethernet pairs (<code>veth</code>)</li>
              <li>Kubernetes CNI plugins</li>
              <li>Linux bridging for VMs</li>
              <li>Open vSwitch for virtual networks</li>
              <li>Tun/tap interface creation</li>
            </ul>
            <p>Understanding native Linux networking makes learning these technologies much easier.</p>
          </div>
          `,
        ],
        syntaxPages: [
          `
          <div>
            <h3 class="text-lg font-semibold mb-3">🧾 Core Syntax</h3>
            <div class="space-y-3">
              <div>
                <p class="font-medium">View all interfaces</p>
                <pre class="bg-black/60 text-white rounded-md p-3 overflow-auto text-sm"><code>ip a</code></pre>
              </div>
              <div>
                <p class="font-medium">View link‑layer devices</p>
                <pre class="bg-black/60 text-white rounded-md p-3 overflow-auto text-sm"><code>ip link</code></pre>
              </div>
              <div>
                <p class="font-medium">View IPv4/IPv6 addresses</p>
                <pre class="bg-black/60 text-white rounded-md p-3 overflow-auto text-sm"><code>ip addr show</code></pre>
              </div>
              <div>
                <p class="font-medium">Check routing table</p>
                <pre class="bg-black/60 text-white rounded-md p-3 overflow-auto text-sm"><code>ip route</code></pre>
              </div>
              <div>
                <p class="font-medium">Enable IP forwarding</p>
                <pre class="bg-black/60 text-white rounded-md p-3 overflow-auto text-sm"><code>echo 1 &gt; /proc/sys/net/ipv4/ip_forward</code></pre>
              </div>
              <div>
                <p class="font-medium">Show ARP/NDP neighbor table</p>
                <pre class="bg-black/60 text-white rounded-md p-3 overflow-auto text-sm"><code>ip neigh</code></pre>
              </div>
              <div>
                <p class="font-medium">Kernel network parameters</p>
                <pre class="bg-black/60 text-white rounded-md p-3 overflow-auto text-sm"><code>sysctl -a | grep net</code></pre>
              </div>
            </div>
          </div>
          `,
        ],
      },
      {
        id: 'interfaces-links-routes',
        title: 'Topic 2: Network Interfaces, Links & Routes',
        theoryPages: [
          `
          <div>
            <h2 class="text-xl font-semibold mb-3">Linux Network Interfaces (Deep Technical)</h2>
            <p class="mb-4">An <strong>interface</strong> is any logical or physical network connection recognized by the Linux kernel. Interfaces expose properties at Layer 2 (MAC, MTU, qdisc, state) and accumulate runtime statistics (RX/TX counters).</p>
            <h3 class="text-lg font-semibold mb-2">Types of Interfaces</h3>
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <p class="font-medium mb-1">Physical</p>
                <ul class="list-disc ml-6">
                  <li><code>eth0</code>, <code>enp0s3</code> — Ethernet (predictable naming)</li>
                  <li><code>wlan0</code> — Wi‑Fi</li>
                  <li><code>eno1</code>, <code>ens33</code> — Server NICs</li>
                </ul>
              </div>
              <div>
                <p class="font-medium mb-1">Virtual</p>
                <ul class="list-disc ml-6">
                  <li><code>lo</code> — loopback</li>
                  <li><code>docker0</code> — Docker bridge</li>
                  <li><code>vethXYZ</code> — container endpoints</li>
                  <li><code>br0</code> — Linux bridge</li>
                  <li><code>bond0</code> — NIC bonding (LACP/active‑backup)</li>
                  <li><code>tun0</code>, <code>tap0</code> — VPNs (OpenVPN/WireGuard/IPSec)</li>
                </ul>
              </div>
            </div>
            <h3 class="text-lg font-semibold mt-4 mb-2">Core Properties</h3>
            <ul class="list-disc ml-6">
              <li>MAC address</li>
              <li>MTU (maximum transmission unit)</li>
              <li>Queue discipline (qdisc)</li>
              <li>State (UP/DOWN)</li>
              <li>Statistics (RX/TX counters)</li>
            </ul>

            <hr class="my-4 border-white/10" />
            <h2 class="text-xl font-semibold mb-3">Link Layer Configuration</h2>
            <p class="mb-3">Linux uses <strong>ip link</strong> for Layer 2 operations. Common actions:</p>
            <ul class="list-disc ml-6 mb-3">
              <li>Show link details</li>
              <li>Set interface state</li>
              <li>Change MTU</li>
              <li>Change MAC address</li>
            </ul>
            <div class="space-y-3">
              <div>
                <p class="font-medium">Show link details</p>
                <pre class="bg-black/60 text-white rounded-md p-3 overflow-auto text-sm"><code>ip link show</code></pre>
              </div>
              <div>
                <p class="font-medium">Set interface UP/DOWN</p>
                <pre class="bg-black/60 text-white rounded-md p-3 overflow-auto text-sm"><code>ip link set eth0 up\nip link set eth0 down</code></pre>
              </div>
              <div>
                <p class="font-medium">Change MTU</p>
                <pre class="bg-black/60 text-white rounded-md p-3 overflow-auto text-sm"><code>ip link set eth0 mtu 1400</code></pre>
              </div>
              <div>
                <p class="font-medium">Change MAC address</p>
                <pre class="bg-black/60 text-white rounded-md p-3 overflow-auto text-sm"><code>ip link set eth0 address 00:11:22:33:44:55</code></pre>
              </div>
            </div>
            <p class="mt-3">Useful in VPNs, bypassing MAC‑based ACLs, and virtual labs.</p>
          </div>
          `,
          `
          <div>
            <h2 class="text-xl font-semibold mb-3">IP Address Management</h2>
            <p class="mb-3">Assign and manage IPv4/IPv6 addresses with <strong>ip addr</strong>.</p>
            <div class="space-y-3">
              <div>
                <p class="font-medium">Add an IPv4 address</p>
                <pre class="bg-black/60 text-white rounded-md p-3 overflow-auto text-sm"><code>ip addr add 192.168.1.10/24 dev eth0</code></pre>
              </div>
              <div>
                <p class="font-medium">Add an IPv6 address</p>
                <pre class="bg-black/60 text-white rounded-md p-3 overflow-auto text-sm"><code>ip -6 addr add 2001:db8::5/64 dev eth0</code></pre>
              </div>
              <div>
                <p class="font-medium">Remove an IP</p>
                <pre class="bg-black/60 text-white rounded-md p-3 overflow-auto text-sm"><code>ip addr del 192.168.1.10/24 dev eth0</code></pre>
              </div>
              <div>
                <p class="font-medium">View all IPs</p>
                <pre class="bg-black/60 text-white rounded-md p-3 overflow-auto text-sm"><code>ip -brief addr</code></pre>
              </div>
            </div>

            <hr class="my-4 border-white/10" />
            <h2 class="text-xl font-semibold mb-3">Routing Fundamentals</h2>
            <p class="mb-3">The kernel routing table decides how packets exit the system.</p>
            <h3 class="text-lg font-semibold mb-2">Types of Routes</h3>
            <ul class="list-disc ml-6 mb-3">
              <li><strong>Connected</strong> — auto‑created for directly attached subnets</li>
              <li><strong>Static</strong> — manually added routes</li>
              <li><strong>Default</strong> — used when nothing else matches</li>
            </ul>
            <p>Static routes are common in small networks, labs, and DMZs; default routes steer general Internet traffic.</p>

            <hr class="my-4 border-white/10" />
            <h2 class="text-xl font-semibold mb-3">Route Lookup Logic</h2>
            <p class="mb-3">Linux makes forwarding decisions using the same principles as enterprise routers:</p>
            <ol class="list-decimal ml-6 mb-3">
              <li>Longest prefix match (most specific subnet)</li>
              <li>Metric value (lower is preferred)</li>
              <li>Routing policy database (RPDB) rules</li>
              <li>Multipath routing decisions (if configured)</li>
            </ol>
            <p>This mirrors behavior on Cisco/Juniper and modern network stacks.</p>
          </div>
          `,
        ],
        syntaxPages: [
          `
          <div>
            <h3 class="text-lg font-semibold mb-3">Routing — Syntax Quick Reference</h3>
            <div class="space-y-3">
              <div>
                <p class="font-medium">Show routing table</p>
                <pre class="bg-black/60 text-white rounded-md p-3 overflow-auto text-sm"><code>ip route</code></pre>
              </div>
              <div>
                <p class="font-medium">Add a static route</p>
                <pre class="bg-black/60 text-white rounded-md p-3 overflow-auto text-sm"><code>ip route add 10.0.0.0/24 via 192.168.1.1</code></pre>
              </div>
              <div>
                <p class="font-medium">Delete route</p>
                <pre class="bg-black/60 text-white rounded-md p-3 overflow-auto text-sm"><code>ip route del 10.0.0.0/24</code></pre>
              </div>
              <div>
                <p class="font-medium">Add default gateway</p>
                <pre class="bg-black/60 text-white rounded-md p-3 overflow-auto text-sm"><code>ip route add default via 192.168.1.1</code></pre>
              </div>
              <div>
                <p class="font-medium">Replace default</p>
                <pre class="bg-black/60 text-white rounded-md p-3 overflow-auto text-sm"><code>ip route replace default via 192.168.1.254</code></pre>
              </div>
              <div>
                <p class="font-medium">Show IPv6 routes</p>
                <pre class="bg-black/60 text-white rounded-md p-3 overflow-auto text-sm"><code>ip -6 route show</code></pre>
              </div>
            </div>
          </div>
          `,
        ],
      },
      {
        id: 'static-dynamic-routing',
        title: 'Topic 3: Static & Dynamic Routing in Linux',
        theoryPages: [
          `
          <div>
            <h2 class="text-xl font-semibold mb-3">Static & Dynamic Routing in Linux</h2>
            <p class="mb-4">Routing determines how packets travel from one network to another. Linux uses a kernel-level routing table that decides the next-hop for each destination.</p>
            <p class="mb-4">Static routing is manually configured and does not change unless an administrator updates it. It is used in small networks, lab setups, VPN routes, enterprise DMZ routes, and multi-subnet servers. Static routes provide full control but require manual updates if topology changes.</p>
            <p class="mb-4">Dynamic routing, on the other hand, automatically updates routes using routing protocols like RIP, OSPF, BGP, etc. Linux does not implement routing protocols natively, but routing daemons like Quagga, FRRouting (FRR), and Bird are used to add dynamic routing functionality. Dynamic routing is essential in scalable networks, ISPs, large datacenters, and cloud topologies because it prevents downtime caused by broken routes.</p>
            <h3 class="text-lg font-semibold mt-4 mb-2">Conclusion</h3>
            <p>Static routing gives full manual control, while dynamic routing provides automatic adaptation in large networks. Linux supports both, making it ideal for routers, firewalls, gateways, and enterprise servers.</p>
          </div>
          `,
        ],
      },
      {
        id: 'host-files-dns',
        title: 'Topic 4: Host Files, resolv.conf & DNS Configuration',
        theoryPages: [
          `
          <div>
            <h2 class="text-xl font-semibold mb-3">Host Files, resolv.conf & DNS Configuration</h2>
            <p class="mb-4">Linux resolves domain names using multiple components: <code>/etc/hosts</code>, <code>/etc/resolv.conf</code>, and system services like <strong>systemd-resolved</strong> or <strong>NetworkManager</strong>. The hosts file acts as a static override, mapping domain names to IPs manually. This is useful for custom DNS redirection, testing websites before going live, blocking domains, or setting internal server names.</p>
            <p class="mb-4"><code>resolv.conf</code> defines DNS servers, search domains, and lookup order. Modern systems may rewrite this file automatically using NetworkManager or systemd-resolved. Proper DNS configuration ensures your system can resolve external domains, internal company servers, and cloud resources. Misconfigured DNS commonly causes errors like "server not found", "temporary failure in name resolution", or slow browsing.</p>
            <h3 class="text-lg font-semibold mt-4 mb-2">Conclusion</h3>
            <p>Linux name resolution begins with <code>/etc/hosts</code>, then moves to the configured DNS servers in <code>resolv.conf</code>. Proper DNS configuration is essential for internet access, internal network communication, and server management.</p>
          </div>
          `,
        ],
      },
      {
        id: 'socket-programming-basics',
        title: 'Topic 5: Socket Programming Basics (Theory)',
        theoryPages: [
          `
          <div>
            <h2 class="text-xl font-semibold mb-3">Socket Programming Basics (Theory)</h2>
            <p class="mb-4">Socket programming allows applications to communicate over the network using TCP, UDP, or raw sockets. A socket is an endpoint created by an application to send/receive data over IP networks. At a high level, socket programming involves creating a socket, binding it to an IP/port, listening, accepting connections (TCP), or sending/receiving datagrams (UDP). It forms the foundation of web servers, chat apps, proxies, VPNs, SSH, and most network applications.</p>
            <p class="mb-4">Linux implements sockets using system calls such as <code>socket()</code>, <code>bind()</code>, <code>listen()</code>, <code>connect()</code>, <code>send()</code>, and <code>recv()</code>. TCP sockets establish reliable, connection-oriented communication, while UDP sockets provide fast, connectionless datagrams. Understanding socket basics helps engineers debug connections, analyze traffic using tools like <code>tcpdump</code>, and develop simple networking scripts in Python/C.</p>
            <h3 class="text-lg font-semibold mt-4 mb-2">Conclusion</h3>
            <p>Socket programming is the base layer of network application development and is essential for engineers who troubleshoot protocols, create automation tools, or develop network services.</p>
          </div>
          `,
        ],
      },
      {
        id: 'ssh-scp-secure-remote-access',
        title: 'Topic 6: SSH, SCP & Secure Remote Access',
        theoryPages: [
          `
          <div>
            <h2 class="text-xl font-semibold mb-3">Overview</h2>
            <p class="mb-4">Secure Shell (SSH) is the most widely used protocol for secure remote login and encrypted communication between systems. It replaces insecure protocols such as Telnet and rsh, offering confidentiality, integrity, and authentication.</p>
            <p class="mb-4">In Linux networking, SSH is essential for managing servers, transferring files securely, and tunneling traffic. Along with SSH, tools like SCP and SFTP provide encrypted file transfers, while SSH keys enable passwordless and more secure access.</p>
            <p class="mb-4">This lesson covers the SSH service, client usage, key-based authentication, configuration hardening, and secure file transfer.</p>
            <h3 class="text-lg font-semibold mt-4 mb-2">1) SSH Basics</h3>
            <ul class="list-disc ml-6 mb-2">
              <li>Uses TCP port <code>22</code></li>
              <li>Public key cryptography for authentication</li>
              <li>Encryption (AES, ChaCha20, etc.)</li>
              <li>Integrity checking (MAC algorithms)</li>
            </ul>
            <p class="mb-2">To connect to a remote machine:</p>
            <pre class="bg-black/60 text-white rounded-md p-3 overflow-auto text-sm"><code>ssh username@server_ip</code></pre>
            <p class="mb-4">On the first connection, SSH stores the server fingerprint in <code>~/.ssh/known_hosts</code>.</p>
            <h3 class="text-lg font-semibold mt-4 mb-2">2) SSH Server (sshd)</h3>
            <p class="mb-2">The SSH server runs through:</p>
            <ul class="list-disc ml-6 mb-2">
              <li>Binary: <code>sshd</code></li>
              <li>Config file: <code>/etc/ssh/sshd_config</code></li>
              <li>Service: <code>systemctl status sshd</code></li>
            </ul>
            <p class="mb-2">Common configuration fields:</p>
            <ul class="list-disc ml-6 mb-2">
              <li><code>Port 22</code> → change for security</li>
              <li><code>PermitRootLogin no</code></li>
              <li><code>PasswordAuthentication no</code> (after keys are configured)</li>
              <li><code>AllowUsers admin</code></li>
            </ul>
            <p class="mb-2">After editing:</p>
            <pre class="bg-black/60 text-white rounded-md p-3 overflow-auto text-sm"><code>systemctl restart sshd</code></pre>
            <h3 class="text-lg font-semibold mt-4 mb-2">3) Password vs Key-Based Authentication</h3>
            <p class="mb-2"><strong>Password authentication</strong> is simple but vulnerable to brute-force attacks.</p>
            <p class="mb-2"><strong>Key-based authentication (recommended)</strong> is more secure, enables automation, and eliminates password exposure.</p>
            <p class="mb-2">Steps:</p>
            <ul class="list-disc ml-6 mb-2">
              <li>Generate keys: <code>ssh-keygen</code></li>
              <li>Copy public key: <code>ssh-copy-id user@server</code></li>
              <li>Disable passwords for better security</li>
              <li>Public key stored on server: <code>~/.ssh/authorized_keys</code></li>
            </ul>
            <h3 class="text-lg font-semibold mt-4 mb-2">4) Secure File Transfer (SCP & SFTP)</h3>
            <p class="mb-2"><strong>SCP (Secure Copy)</strong> is a simple command-line file transfer tool built on SSH.</p>
            <p class="mb-2">Examples:</p>
            <ul class="list-disc ml-6 mb-2">
              <li>Upload a file → local → remote</li>
              <li>Download a file → remote → local</li>
              <li>Copy directories using <code>-r</code></li>
            </ul>
            <p class="mb-2"><strong>SFTP</strong> provides an interactive file transfer session (safer than FTP) with resume, directory navigation, and better security.</p>
            <h3 class="text-lg font-semibold mt-4 mb-2">5) SSH Tunneling (Port Forwarding)</h3>
            <p class="mb-2">SSH can tunnel traffic securely:</p>
            <ul class="list-disc ml-6 mb-2">
              <li><strong>Local forwarding</strong>: forward local port → remote service</li>
              <li><strong>Remote forwarding</strong>: expose local service on remote machine</li>
              <li><strong>Dynamic forwarding</strong>: create a SOCKS proxy (acts as secure VPN-like tunnel)</li>
            </ul>
            <p class="mb-2">Example uses:</p>
            <ul class="list-disc ml-6 mb-2">
              <li>Securely access internal websites</li>
              <li>Encrypt traffic on public WiFi</li>
              <li>Bypass filtering/firewalls (legal environments only)</li>
            </ul>
            <h3 class="text-lg font-semibold mt-4 mb-2">Conclusion</h3>
            <p class="mb-2">SSH is the foundation of secure remote access in Linux. Mastering SSH, SCP, SFTP, and tunneling is critical before working with VPNs, firewalls, or enterprise networking.</p>
            <p class="mb-2">You should now understand:</p>
            <ul class="list-disc ml-6">
              <li>How to connect via SSH</li>
              <li>Configure sshd server</li>
              <li>Use key-based authentication</li>
              <li>Transfer files securely</li>
              <li>Perform tunneling for secure access</li>
            </ul>
          </div>
          `,
        ],
      },
      {
        id: 'network-namespaces-virtual-interfaces',
        title: 'Topic 7: Network Namespaces & Virtual Interfaces',
        theoryPages: [
          `
          <div>
            <h2 class="text-xl font-semibold mb-3">Overview</h2>
            <p class="mb-4">Network namespaces allow Linux to create isolated network stacks, each having its own interfaces, IP addresses, routing tables, firewall rules, ARP table, and sockets. This is the foundation of containers, network simulations, and virtual labs.</p>
            <p class="mb-4">With namespaces, one Linux system can behave like multiple independent network devices—similar to virtual routers or hosts. Virtual interfaces (veth pairs, bridges, VLANs, dummy interfaces) allow traffic to pass between namespaces or emulate networks for testing.</p>

            <h3 class="text-lg font-semibold mt-4 mb-2">1) What is a Network Namespace?</h3>
            <p class="mb-2">A network namespace creates a separate environment where:</p>
            <ul class="list-disc ml-6 mb-2">
              <li><code>eth0</code> inside the namespace ≠ <code>eth0</code> outside</li>
              <li>Pings, routes, connections are isolated</li>
              <li>Processes run with dedicated network stacks</li>
            </ul>
            <p class="mb-2">Example use cases:</p>
            <ul class="list-disc ml-6 mb-2">
              <li>Container networking (Docker, Kubernetes)</li>
              <li>Testing firewalls and routing</li>
              <li>Creating virtual labs</li>
              <li>Simulating enterprise networks</li>
            </ul>

            <h3 class="text-lg font-semibold mt-4 mb-2">2) Basic Namespace Operations</h3>
            <p class="mb-2">You can create/delete namespaces, run commands inside them, assign interfaces, and configure routing.</p>
            <p class="mb-2">Namespaces are stored under: <code>/var/run/netns/</code>.</p>

            <h3 class="text-lg font-semibold mt-4 mb-2">3) veth Pairs – Virtual Cables</h3>
            <p class="mb-2">A veth pair consists of two connected interfaces:</p>
            <pre class="bg-black/60 text-white rounded-md p-3 overflow-auto text-sm"><code>veth0 <------> veth1</code></pre>
            <p class="mb-2">If one end is inside a namespace and the other outside, they act like a physical cable between two computers.</p>
            <p class="mb-2">Used for:</p>
            <ul class="list-disc ml-6 mb-2">
              <li>Connecting namespaces to bridges (like switch ports)</li>
              <li>Simulating routers</li>
              <li>Container networking</li>
            </ul>

            <h3 class="text-lg font-semibold mt-4 mb-2">4) Connecting Namespaces</h3>
            <p class="mb-2">Steps to fully connect namespaces:</p>
            <ul class="list-disc ml-6 mb-2">
              <li>Create veth pair</li>
              <li>Move one veth to namespace</li>
              <li>Assign IPs</li>
              <li>Bring interfaces up</li>
              <li>Add routes</li>
              <li>Test via ping</li>
            </ul>
            <p class="mb-4">You can build multi-router topologies on a single machine this way.</p>

            <h3 class="text-lg font-semibold mt-4 mb-2">5) Common Virtual Network Interfaces</h3>
            <ul class="list-disc ml-6 mb-2">
              <li><strong>veth</strong> – virtual Ethernet used to connect namespaces/containers.</li>
              <li><strong>bridge</strong> – virtual switch used to connect multiple veth interfaces.</li>
              <li><strong>dummy</strong> – fake interface useful for routing and BGP demos.</li>
              <li><strong>macvlan / ipvlan</strong> – assign multiple MAC/IP identities to a single NIC.</li>
            </ul>

            <h3 class="text-lg font-semibold mt-4 mb-2">Conclusion</h3>
            <p class="mb-2">Network namespaces enable powerful network simulations directly inside Linux. By mastering namespaces and virtual interfaces, you can build:</p>
            <ul class="list-disc ml-6 mb-2">
              <li>Virtual routers</li>
              <li>Virtual switches</li>
              <li>Multi-host labs</li>
              <li>Container networks</li>
              <li>Complex enterprise-style topologies</li>
            </ul>
            <p>This knowledge is essential before moving into routing, switching, VLANs, and security devices.</p>
          </div>
          `,
        ],
      },
    ],
  },
];

// Append Advanced Module 2: Network Scanning & Analysis Tools
MODULES.push({
  id: 'module-2',
  title: 'Advanced Module 2: Network Scanning & Analysis Tools',
  topics: [
    {
      id: 'nmap-nse',
      title: 'Deep-dive into Nmap scripting engine (NSE)',
      theoryPages: [
        `
        <div>
          <h2 class="text-2xl font-bold mb-2">Deep-Dive into Nmap Scripting Engine (NSE)</h2>
          <p class="mb-4">Nmap’s Scripting Engine (NSE) transforms Nmap from a simple port scanner into a scalable network exploration and automation framework. Written in Lua, NSE enables:</p>
          <ul class="list-disc ml-6 mb-4">
            <li>Complex service enumeration</li>
            <li>Vulnerability detection (CVE matching, misconfig scans)</li>
            <li>Authentication testing</li>
            <li>Protocol-specific probing</li>
            <li>Malware/backdoor detection</li>
            <li>Network discovery automation</li>
            <li>Custom script development</li>
          </ul>
          <p class="mb-6">It is one of the most advanced scanning engines available in open-source security tools.</p>

          <h3 class="text-lg font-semibold mt-4 mb-2">1) NSE Architecture: How It Works Internally</h3>
          <ul class="list-disc ml-6 mb-4">
            <li>Nmap discovers open ports/services</li>
            <li>NSE script categories trigger based on port number, service type, and additional conditions</li>
            <li>Scripts execute in parallel threads using Nmap’s coroutines</li>
            <li>Nmap merges script outputs into scan results</li>
          </ul>
          <p class="mb-2">Scripts live in: <code>/usr/share/nmap/scripts/</code></p>
          <p class="mb-4">Metadata for each script is stored in: <code>/usr/share/nmap/scripts/script.db</code></p>

          <h3 class="text-lg font-semibold mt-4 mb-2">2) Script Categories & Real Use Cases</h3>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <p class="font-medium">safe</p>
              <p class="text-sm mb-2">Read-only information gathering, no risk to target</p>
              <p class="text-sm">Examples: <code>http-title</code>, <code>ssh-hostkey</code>, <code>dns-brute</code></p>
            </div>
            <div>
              <p class="font-medium">default</p>
              <p class="text-sm mb-2">Executed with <code>-sC</code>, lightweight enumeration</p>
              <p class="text-sm">Examples: <code>ssl-cert</code>, <code>http-server-header</code></p>
            </div>
            <div>
              <p class="font-medium">auth</p>
              <p class="text-sm mb-2">Authentication-related scans</p>
              <p class="text-sm">Examples: <code>imap-auth</code>, <code>ftp-anon</code></p>
            </div>
            <div>
              <p class="font-medium">vuln</p>
              <p class="text-sm mb-2">Detects known vulnerabilities, validates misconfigurations</p>
              <p class="text-sm">Examples: <code>smb-vuln-ms17-010</code>, <code>http-vuln-cve2017-5638</code></p>
            </div>
            <div>
              <p class="font-medium">brute</p>
              <p class="text-sm mb-2">Password brute forcing (authorized environments)</p>
              <p class="text-sm">Examples: <code>mysql-brute</code>, <code>ssh-brute</code></p>
            </div>
            <div>
              <p class="font-medium">intrusive</p>
              <p class="text-sm mb-2">May crash services or cause logs</p>
              <p class="text-sm">Examples: <code>snmp-brute</code>, <code>http-shellshock</code></p>
            </div>
            <div>
              <p class="font-medium">broadcast</p>
              <p class="text-sm mb-2">LAN broadcast discovery (local networks)</p>
              <p class="text-sm">Examples: <code>broadcast-dhcp-discover</code></p>
            </div>
          </div>

          <h3 class="text-lg font-semibold mt-4 mb-2">3) Script Execution Logic</h3>
          <ul class="list-disc ml-6 mb-4">
            <li><strong>prerule</strong> – checks before scanning</li>
            <li><strong>portrule</strong> – determines if script should run on a port</li>
            <li><strong>hostrule</strong> – applies to host-level info</li>
            <li><strong>postrule</strong> – runs after everything</li>
          </ul>
          <p class="mb-2">Example <code>portrule</code>:</p>
          <pre class="bg-black/60 text-white rounded-md p-3 overflow-auto text-sm"><code>portrule = function(host, port)
  return port.number == 80 and port.protocol == "tcp"
end</code></pre>
          <p class="mt-2">This determines when a script runs — highly efficient for large-scale scans.</p>

          <h3 class="text-lg font-semibold mt-4 mb-2">4) NSE & Version Detection Synergy</h3>
          <p class="mb-2">Nmap’s service detection (<code>-sV</code>) provides:</p>
          <ul class="list-disc ml-6 mb-4">
            <li>Protocol type</li>
            <li>Application name/version</li>
            <li>SSL/TLS information</li>
            <li>Hashing algorithm support</li>
            <li>Fingerprint matches</li>
          </ul>
          <p class="mb-2">NSE uses this information to run relevant scripts.</p>
          <p class="mb-4">Example: If port <code>445</code> → SMB detected → run SMB vuln scripts.</p>

          <h3 class="text-lg font-semibold mt-4 mb-2">5) Real-World Enterprise Use</h3>
          <ul class="list-disc ml-6 mb-2">
            <li>Checking patch levels</li>
            <li>Detecting default credentials</li>
            <li>Identifying outdated SSL/TLS configurations</li>
            <li>Auditing databases</li>
            <li>Discovering exposed administrative interfaces</li>
            <li>Automated nightly scans</li>
          </ul>
          <p class="mb-4">Penetration testers use NSE to identify exploitable services, test authentication weaknesses, discover hidden directories/files, interrogate SNMP/SMB/FTP/SSH/database servers, and validate critical vulnerabilities like EternalBlue.</p>

          <h3 class="text-lg font-semibold mt-4 mb-2">6) Script Arguments (Deep Technical)</h3>
          <p class="mb-2">Modify script behavior using: <code>--script-args 'key=value,key2=value2'</code></p>
          <p class="mb-2">Common args:</p>
          <ul class="list-disc ml-6 mb-4">
            <li><code>timeout</code></li>
            <li><code>basepath</code></li>
            <li><code>passdb</code>/<code>userdb</code></li>
            <li><code>http.useragent</code></li>
            <li><code>dns.server</code></li>
            <li><code>broadcast.delay</code></li>
          </ul>

          <h3 class="text-lg font-semibold mt-4 mb-2">Conclusion</h3>
          <p class="mb-2">Nmap NSE is not just an extension — it’s a complete network investigation framework, used by:</p>
          <ul class="list-disc ml-6 mb-4">
            <li>Red teams</li>
            <li>Blue teams</li>
            <li>Forensics analysts</li>
            <li>Network engineers</li>
            <li>Cloud security teams</li>
          </ul>
          <p class="mb-2">Mastering NSE is essential for advanced scanning operations.</p>
        </div>
        `,
      ],
      syntaxPages: [
        `
        <div>
          <h3 class="text-lg font-semibold mb-3">NSE Syntax Quick Reference</h3>
          <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code># Default scripts + version detection
nmap -sC -sV target

# Run specific script
nmap --script=http-title target

# Run category scan
nmap --script=vuln target

# Multiple categories
nmap --script="vuln,auth" target

# Pass script arguments
nmap --script=http-enum --script-args 'http-enum.basepath=/admin' target

# SMB vulnerability example
nmap -p445 --script=smb-vuln-ms17-010 target

# Update script DB
nmap --script-updatedb

# Get help for a script
nmap --script-help=http-passwd</code></pre>
        </div>
        `,
      ],
      syntaxPages: [
        `
        <div>
          <h3 class="text-lg font-semibold mb-3">🧾 Enumeration Syntax</h3>
          <div class="space-y-4">
            <div>
              <p class="font-medium">Masscan (Host &amp; Port Discovery)</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>masscan 10.0.0.0/16 -p0-65535 --rate 30000 -oG discovery.txt
masscan -iL targets.txt -p80,443 --rate 5000 -oX out.xml</code></pre>
            </div>
            <div>
              <p class="font-medium">Nmap Enumeration</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code># Basic deep scan
nmap -sC -sV target

# Aggressive scan (OS + version + traceroute + scripts)
nmap -A target

# Vulnerability script scan
nmap --script=vuln -p445 target

# Full port scan
nmap -p- target

# Top 1000 + version detection
nmap -sV target</code></pre>
            </div>
            <div>
              <p class="font-medium">Manual Enumeration</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code># Netcat banner grabbing
nc target 22
nc target 25
echo "HEAD / HTTP/1.0" | nc target 80

# SMB enumeration
smbclient -L \\target -N
smbmap -H target

# SNMP enumeration
snmpwalk -v2c -c public target

# HTTP enumeration
curl -I http://target
curl http://target/robots.txt

# MySQL probe
mysql -h target -u root -p</code></pre>
            </div>
            <div>
              <p class="font-medium">OS Fingerprinting</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>nmap -O target
nmap --osscan-guess target</code></pre>
            </div>
            <div>
              <p class="font-medium">tcpdump Monitoring</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>tcpdump -i eth0
tcpdump -nvvv port 80
tcpdump -w capture.pcap</code></pre>
            </div>
            <div>
              <p class="font-medium">Connection Tracking</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ss -tulnp
ss -tan state established</code></pre>
            </div>
          </div>
        </div>
        `
      ],
    },
    {
      id: 'masscan',
      title: 'Masscan for high-speed scanning',
      theoryPages: [
        `
        <div>
          <h2 class="text-xl font-semibold mb-3">✅ TOPIC 2: Masscan for High-Speed Scanning</h2>
          <p class="mb-4">Masscan is a high-performance TCP SYN scanner capable of scanning the entire IPv4 internet in under 5 minutes (at >10M packets per second). It uses a custom asynchronous TCP/IP stack, making it faster than Nmap for raw port discovery.</p>

          <h3 class="text-lg font-semibold mb-2">1. Masscan Architecture (How It Works)</h3>
          <p class="mb-3">Masscan does NOT use Linux’s normal TCP stack. It crafts raw SYN packets using its own independent engine:</p>
          <ul class="list-disc ml-6 mb-3">
            <li>Sends stateless SYN packets</li>
            <li>Tracks state internally (TCP connection not established)</li>
            <li>Uses asynchronous capture of SYN-ACK responses</li>
            <li>Maps responses to scanned hosts</li>
          </ul>
          <p class="mb-4">This design makes Masscan extremely fast, ideal for large networks, and suitable for internet-wide research.</p>

          <h3 class="text-lg font-semibold mb-2">2. Scan Rate and Network Impact</h3>
          <p class="mb-2"><strong>Important:</strong> Masscan can overload networks if the rate is too high.</p>
          <ul class="list-disc ml-6 mb-3">
            <li>Default rate: <code>100</code> packets/second</li>
            <li>Maximum practical rate on 10Gbps networks: up to <code>10M</code> pps</li>
          </ul>
          <div class="space-y-2">
            <p class="font-medium">Example throttling:</p>
            <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>masscan 0.0.0.0/0 -p80 --rate 10000</code></pre>
          </div>
          <p class="mt-3">Rate control helps prevent switch/router overload, firewall throttling, packet drops, and IDS triggers.</p>

          <h3 class="text-lg font-semibold mb-2">3. Reliable Large-Scale Workflow</h3>
          <ol class="list-decimal ml-6 mb-3">
            <li>Discover open ports quickly with Masscan</li>
            <li>Export targets to a file</li>
            <li>Feed results into Nmap for detailed analysis</li>
          </ol>
          <div class="space-y-2">
            <p class="font-medium">Example:</p>
            <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>masscan -p22,80,443 172.16.0.0/12 --rate 10000 -oG mass.txt
nmap -sV -iL mass_hits.txt</code></pre>
          </div>
          <p class="mt-3">This is a standard approach in modern penetration tests and enterprise attack surface management.</p>

          <h3 class="text-lg font-semibold mb-2">4. Common Enterprise Use Cases</h3>
          <ul class="list-disc ml-6 mb-4">
            <li>Cloud-hosted network audits</li>
            <li>Internet asset inventory</li>
            <li>Identifying shadow IT</li>
            <li>PCI/ISO compliance monitoring</li>
            <li>Large network exposure mapping</li>
            <li>Security research on open ports</li>
            <li>Scout scans before red-team operations</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">5. Limitations</h3>
          <ul class="list-disc ml-6 mb-2">
            <li>Cannot perform service detection (<code>-sV</code>)</li>
            <li>Cannot run NSE scripts</li>
            <li>Uses a custom TCP engine → results may differ from Nmap</li>
            <li>Not ideal for internal segment stealth</li>
          </ul>
          <p class="mb-2">But as a raw discovery tool, it is unmatched.</p>
        </div>
        `,
      ],
      syntaxPages: [
        `
        <div>
          <h3 class="text-lg font-semibold mb-3">🧾 Masscan Syntax</h3>
          <div class="space-y-3">
            <div>
              <p class="font-medium">Fast scan on 80 port</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>masscan 192.168.1.0/24 -p80</code></pre>
            </div>
            <div>
              <p class="font-medium">Full port scan (all ports)</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>masscan 10.0.0.0/24 -p0-65535 --rate 5000</code></pre>
            </div>
            <div>
              <p class="font-medium">Scan many ports with throttling</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>masscan 172.16.0.0/16 -p22,80,443 --rate 20000</code></pre>
            </div>
            <div>
              <p class="font-medium">Output results to XML/JSON</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>masscan -p443 0.0.0.0/0 -oX out.xml
masscan -p443 0.0.0.0/0 -oJ out.json</code></pre>
            </div>
            <div>
              <p class="font-medium">Read targets from file</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>masscan -p80 -iL iplist.txt</code></pre>
            </div>
          </div>
        </div>
        `,
      ],
    },
    {
      id: 'netcat-banner',
      title: 'Netcat (nc) for port listening & banner grabbing',
      theoryPages: [
        `
        <div>
          <h2 class="text-xl font-semibold mb-3">✅ TOPIC 3: Netcat (nc) for Port Listening & Banner Grabbing</h2>
          <p class="mb-4">Netcat is a versatile TCP/UDP utility capable of creating client/server connections, listening on ports, inspecting text-based services, transferring data, performing manual protocol testing, basic port scanning, and setting up reverse/bind shells (only in legal labs).</p>
          <p class="mb-4">For advanced testing, Netcat is often used when you require direct socket-level communication.</p>

          <h3 class="text-lg font-semibold mb-2">1. Netcat in Real Protocol Testing</h3>
          <p class="mb-2">Netcat allows you to speak directly to services using raw text:</p>
          <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>nc target 80
GET / HTTP/1.1
Host: example.com</code></pre>
          <p class="mt-2">This is crucial for analyzing:</p>
          <ul class="list-disc ml-6 mb-3">
            <li>HTTP headers</li>
            <li>SMTP commands</li>
            <li>FTP communication</li>
            <li>DNS TCP queries</li>
            <li>Custom protocols</li>
          </ul>
          <p class="mb-3">Netcat behaves like a minimalistic telnet, but with binary support.</p>

          <h3 class="text-lg font-semibold mb-2">2. Banner Grabbing (Deep Explanation)</h3>
          <p class="mb-2">Many services reveal metadata when you connect:</p>
          <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>nc 192.168.1.10 21
220 (vsFTPd 3.0.3)</code></pre>
          <p class="mt-2">Why is this important?</p>
          <ul class="list-disc ml-6 mb-3">
            <li>Identifies exact software version</li>
            <li>Helps detect vulnerabilities</li>
            <li>Assists in fingerprinting systems</li>
            <li>Useful for correlation with CVEs</li>
          </ul>
          <p class="mb-2">Netcat can also send crafted probes:</p>
          <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>echo -e "HEAD / HTTP/1.0\r\n\r\n" | nc target 80</code></pre>

          <h3 class="text-lg font-semibold mb-2">3. Netcat as a Listener</h3>
          <p class="mb-2">Netcat can act as a simple TCP server:</p>
          <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>nc -lvp 4444</code></pre>
          <p class="mt-2">Use cases:</p>
          <ul class="list-disc ml-6 mb-3">
            <li>Testing firewall rules</li>
            <li>Emulating simple services</li>
            <li>Receiving file transfers</li>
            <li>Setting up reverse-shell listeners (in labs)</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">4. Netcat in Port Scanning</h3>
          <p class="mb-2">Netcat performs simple port discovery:</p>
          <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>nc -zv host 1-1000</code></pre>
          <p class="mt-2">This is useful when Nmap is blocked or unavailable.</p>
        </div>
        `,
      ],
      syntaxPages: [
        `
        <div>
          <h3 class="text-lg font-semibold mb-3">🧾 Netcat Syntax</h3>
          <div class="space-y-3">
            <div>
              <p class="font-medium">Connect to a port</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>nc target 443</code></pre>
            </div>
            <div>
              <p class="font-medium">Banner grabbing</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>echo "" | nc target 21
echo -e "HEAD / HTTP/1.1\r\n\r\n" | nc target 80</code></pre>
            </div>
            <div>
              <p class="font-medium">Listen on port</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>nc -lvp 4444</code></pre>
            </div>
            <div>
              <p class="font-medium">Port scan</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>nc -zv target 1-1000</code></pre>
            </div>
            <div>
              <p class="font-medium">File transfer</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>nc -lvp 4444 > file.txt
nc host 4444 < file.txt</code></pre>
            </div>
          </div>
        </div>
        `,
      ],
    },
    {
      id: 'tcpdump-advanced',
      title: 'tcpdump Advanced Packet Capture',
      theoryPages: [
        `
        <div>
          <h2 class="text-xl font-semibold mb-3">Overview</h2>
          <p class="mb-3">tcpdump is a low-level packet capture tool that displays packets in real time using Berkeley Packet Filters (BPF). It is essential for troubleshooting network performance, analyzing TCP flags and states, debugging firewall rules, monitoring DNS/ARP/DHCP, detecting anomalies in traffic, and deep packet inspection. tcpdump reads directly from interfaces using libpcap.</p>

          <h3 class="text-lg font-semibold mb-2">1. Understanding BPF Filters</h3>
          <p class="mb-2">Berkeley Packet Filters allow extremely precise selection and run in the kernel for efficiency:</p>
          <ul class="list-disc ml-6 mb-3">
            <li><code>host 192.168.1.5</code></li>
            <li><code>port 443</code></li>
            <li><code>tcp[tcpflags] == tcp-syn</code></li>
            <li><code>udp and port 53</code></li>
            <li><code>src net 192.168.0.0/16</code></li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">2. Packet Structure Analysis</h3>
          <p class="mb-2">Example:</p>
          <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>tcpdump -vvv -i eth0 tcp port 80</code></pre>
          <p class="mt-2">Can show:</p>
          <ul class="list-disc ml-6 mb-3">
            <li>IP header</li>
            <li>TCP flags (SYN, ACK, FIN, RST)</li>
            <li>Sequence numbers</li>
            <li>ACK numbers</li>
            <li>Window sizes</li>
            <li>Options (MSS, SACK, Timestamps)</li>
          </ul>
          <p class="mb-2">This is crucial for diagnosing:</p>
          <ul class="list-disc ml-6 mb-3">
            <li>TCP handshake failures</li>
            <li>Retransmissions</li>
            <li>Connection resets</li>
            <li>MTU issues</li>
            <li>Latency problems</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">3. Capturing Traffic for Wireshark</h3>
          <p class="mb-2">tcpdump can save packets:</p>
          <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>tcpdump -i eth0 -w capture.pcap</code></pre>
          <p class="mt-2">This file can be imported into Wireshark for deep GUI analysis.</p>

          <h3 class="text-lg font-semibold mb-2">4. Real-World Use Cases</h3>
          <ul class="list-disc ml-6 mb-2">
            <li>Detecting DNS exfiltration</li>
            <li>Identifying ARP spoofing</li>
            <li>Monitoring encrypted vs unencrypted traffic</li>
            <li>Debugging VoIP</li>
            <li>Inspecting HTTP headers</li>
            <li>Validating firewall NAT behavior</li>
            <li>Confirming TLS handshake correctness</li>
          </ul>
        </div>
        `,
      ],
      syntaxPages: [
        `
        <div>
          <h3 class="text-lg font-semibold mb-3">🧾 tcpdump Syntax</h3>
          <div class="space-y-3">
            <div>
              <p class="font-medium">Capture all packets</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>tcpdump -i eth0</code></pre>
            </div>
            <div>
              <p class="font-medium">Capture with verbose details</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>tcpdump -vvv -i eth0</code></pre>
            </div>
            <div>
              <p class="font-medium">Filter by protocol or port</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>tcpdump tcp port 443
tcpdump udp port 53</code></pre>
            </div>
            <div>
              <p class="font-medium">Filter by host</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>tcpdump host 192.168.1.10</code></pre>
            </div>
            <div>
              <p class="font-medium">Save to PCAP</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>tcpdump -i eth0 -w file.pcap</code></pre>
            </div>
            <div>
              <p class="font-medium">Read PCAP</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>tcpdump -r file.pcap</code></pre>
            </div>
            <div>
              <p class="font-medium">Show HTTP payload</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>tcpdump -A -s0 tcp port 80</code></pre>
            </div>
          </div>
        </div>
        `,
      ],
    },
    {
      id: 'ss-netstat',
      title: 'ss & netstat for Connection Tracking',
      theoryPages: [
        `
        <div>
          <h2 class="text-xl font-semibold mb-3">Overview</h2>
          <p class="mb-3"><strong>ss</strong> is the modern, fast replacement for <strong>netstat</strong>. It reads information from <code>/proc/net/*</code>, kernel socket tables, and internal TCP metrics to provide immediate insights into listening services, established connections, socket states, queue usage, retransmission counters, and per-process network bindings.</p>

          <h3 class="text-lg font-semibold mb-2">1. Deep Explanation of Output</h3>
          <p class="mb-2">Example:</p>
          <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ss -tuna</code></pre>
          <p class="mt-2">Shows:</p>
          <ul class="list-disc ml-6 mb-3">
            <li><strong>Recv-Q</strong> → packets waiting for the application</li>
            <li><strong>Send-Q</strong> → packets waiting in kernel buffer</li>
            <li><strong>State</strong> → <code>ESTABLISHED</code>, <code>LISTEN</code>, <code>TIME-WAIT</code>, <code>SYN-SENT</code></li>
            <li>Local/Remote addresses</li>
            <li>Associated process (with <code>-p</code>)</li>
          </ul>
          <p class="mb-2">These metrics help diagnose:</p>
          <ul class="list-disc ml-6 mb-3">
            <li>Congestion</li>
            <li>Connection leaks</li>
            <li>Hung services</li>
            <li>Thread exhaustion</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">2. When ss is used</h3>
          <ul class="list-disc ml-6 mb-2">
            <li>Troubleshooting web server saturation</li>
            <li>Identifying malware connections</li>
            <li>Verifying listening ports</li>
            <li>Analyzing long-lived TCP sessions</li>
            <li>Checking load balancer health</li>
          </ul>
          <p class="mb-2">ss is critical for backend engineers and security teams.</p>
        </div>
        `,
      ],
      syntaxPages: [
        `
        <div>
          <h3 class="text-lg font-semibold mb-3">🧾 ss & netstat Syntax</h3>
          <div class="space-y-3">
            <div>
              <p class="font-medium">All connections</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ss -tuna</code></pre>
            </div>
            <div>
              <p class="font-medium">Listening services</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ss -tuln</code></pre>
            </div>
            <div>
              <p class="font-medium">Show processes</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ss -tulpn</code></pre>
            </div>
            <div>
              <p class="font-medium">Filter by state</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ss -tan state established</code></pre>
            </div>
            <div>
              <p class="font-medium">Filter by port</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ss -tan '( sport = :22 )'</code></pre>
            </div>
          </div>
        </div>
        `,
      ],
    },
    {
      id: 'os-fingerprint-version',
      title: 'Scanning Services, OS Fingerprinting & Real-World Enumeration',
      theoryPages: [
        `
        <div>
          <h2 class="text-xl font-semibold mb-3">Enterprise-Grade Enumeration</h2>
          <p class="mb-4">This topic ties all tools together into professional scanning workflows used by cybersecurity teams.</p>

          <h3 class="text-lg font-semibold mb-2">1. Service Scanning (Deep Technical)</h3>
          <p class="mb-2">Nmap’s service detection (<code>-sV</code>) uses:</p>
          <ul class="list-disc ml-6 mb-3">
            <li>TCP handshake</li>
            <li>Probing packets</li>
            <li>Application banner grabbing</li>
            <li>SSL/TLS fingerprinting</li>
            <li>UDP probing (slow but precise)</li>
            <li>Internal match database</li>
          </ul>
          <p class="mb-2">From these it identifies:</p>
          <ul class="list-disc ml-6 mb-3">
            <li>Exact versions</li>
            <li>Default configurations</li>
            <li>CVE-linked version ranges</li>
            <li>Deprecated SSL/TLS algorithms</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">2. OS Fingerprinting</h3>
          <p class="mb-2">Nmap analyzes:</p>
          <ul class="list-disc ml-6 mb-3">
            <li>IP ID sequence</li>
            <li>Initial TTL</li>
            <li>TCP window size</li>
            <li>TCP options order</li>
            <li>ICMP responses</li>
            <li>SYN/ACK characteristics</li>
          </ul>
          <p class="mb-2">Then compares to fingerprint DB. Real usage examples:</p>
          <ul class="list-disc ml-6 mb-3">
            <li>Distinguishing Linux vs BSD vs Windows</li>
            <li>Detecting firewalls (pf, iptables, ASA)</li>
            <li>Identifying embedded/IoT systems</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">3. Enterprise Enumeration Workflow</h3>
          <ol class="list-decimal ml-6 mb-3">
            <li><strong>Fast discovery (Masscan)</strong> — Identify all reachable/open ports quickly.</li>
            <li><strong>Deep analysis (Nmap + NSE)</strong> — Version detection, vulnerabilities, script-based checks.</li>
            <li><strong>Manual verification (Netcat, curl, browser)</strong> — Confirm services and behaviors.</li>
            <li><strong>Packet-level validation (tcpdump)</strong> — Confirm whether traffic is blocked, NATed, or failing.</li>
            <li><strong>System correlation</strong> — Map services → CVEs → vulnerabilities → remediation.</li>
          </ol>
          <p class="mb-2">This workflow is identical to those used by security professionals.</p>
        </div>
        `,
      ],
      syntaxPages: [
        `
        <div>
          <h3 class="text-lg font-semibold mb-3">🧾 Scanning & Enumeration Syntax</h3>
          <div class="space-y-3">
            <div>
              <p class="font-medium">Service detection</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>nmap -sV target
nmap -sV --version-intensity 9 target</code></pre>
            </div>
            <div>
              <p class="font-medium">OS detection</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>nmap -O target
nmap -A target</code></pre>
            </div>
            <div>
              <p class="font-medium">Combined workflow</p>
              <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>masscan -p0-65535 10.0.0.0/24 --rate 5000 -oG mass.txt
nmap -sV -iL mass.txt
nmap --script=vuln -p445 target
echo HEAD / HTTP/1.1 | nc target 80
tcpdump -i eth0 host target</code></pre>
            </div>
          </div>
        </div>
        `,
      ],
    },
    {
      id: 'enumeration-workflows',
      title: 'Real-world enumeration workflows',
      theoryPages: [
        `
        <div>
          <h2 class="text-xl font-semibold mb-3">Real‑World Enumeration Pipeline — Page 1</h2>
          <p class="mb-3">A practical, multi‑stage approach that moves from wide discovery to precise service validation, while observing network behavior to confirm hypotheses and avoid false positives.</p>
          <ol class="list-decimal ml-6 space-y-2">
            <li><strong>Wide discovery (Masscan)</strong> — Sweep large address ranges quickly to identify candidate hosts and ports. Save results for targeted follow‑up.</li>
            <li><strong>Targeted scans (Nmap)</strong> — Refine findings with service/version detection (<code>-sV</code>), scripts (<code>--script</code>), and timing controls (<code>-T</code>).</li>
            <li><strong>Banner & protocol checks (Netcat/curl/openssl)</strong> — Manually validate services and confirm speaking protocols (HTTP/SMTP/FTP/TLS, etc.).</li>
            <li><strong>OS fingerprinting</strong> — Use <code>nmap -O</code>, <code>p0f</code>, or passive hints to anchor expectations and pick the right scripts.</li>
            <li><strong>Packet capture (tcpdump)</strong> — Observe SYN/SYN‑ACK patterns, resets, MTU issues, and TLS handshakes to explain odd scan behavior.</li>
            <li><strong>Connection tracking (ss/netstat)</strong> — Verify local socket states, firewalls/NAT, and ephemeral ports used during enumeration.</li>
            <li><strong>Iterate & record</strong> — Feed confirmed results back into focused Nmap scripts and notes to build a reliable service map.</li>
          </ol>
          <p class="mt-3">This sequence reduces noise, confirms services with multiple viewpoints, and produces an actionable inventory for follow‑up testing.</p>
        </div>
        `,
        `
        <div>
          <h2 class="text-xl font-semibold mb-3">Real‑World Enumeration Flow — Page 2</h2>
          <h3 class="text-lg font-semibold mb-2">3. Real-World Enumeration Flow (Diagram Representation)</h3>
          <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>            ┌──────────────────────────┐
            │   Passive Recon (OSINT)  │
            └─────────────┬────────────┘
                          ▼
            ┌──────────────────────────┐
            │  Masscan (Host Discovery)│
            └─────────────┬────────────┘
                          ▼
            ┌──────────────────────────┐
            │      Nmap Deep Scan      │
            └─────────────┬────────────┘
                          ▼
            ┌──────────────────────────┐
            │  Manual Service Analysis │
            │ (nc, curl, smb, snmp)    │
            └─────────────┬────────────┘
                          ▼
            ┌──────────────────────────┐
            │   OS Fingerprinting      │
            └─────────────┬────────────┘
                          ▼
            ┌──────────────────────────┐
            │ Cross-Correlation Report │
            └─────────────┬────────────┘
                          ▼
            ┌──────────────────────────┐
            │ Continuous Monitoring    │
            └──────────────────────────┘</code></pre>

          <p class="mt-3">This is the industry-standard workflow used by:</p>
          <ul class="list-disc ml-6 space-y-1">
            <li>Red teams</li>
            <li>Pen testers</li>
            <li>SOC analysts</li>
            <li>Blue teams</li>
            <li>Network engineers</li>
            <li>Cloud security teams</li>
          </ul>

          <h3 class="text-lg font-semibold mt-4 mb-2">4. Example: Complete Enumeration of a Host</h3>
          <div class="space-y-3">
            <p class="font-medium">Let’s say Masscan found ports on a host:</p>
            <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>10.10.20.5 → 22, 80, 443, 445, 3306</code></pre>

            <p class="font-medium">Step 1: Nmap Deep Scan</p>
            <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>nmap -sC -sV -p22,80,443,445,3306 10.10.20.5</code></pre>
            <p class="mt-1">We discover:</p>
            <ul class="list-disc ml-6 mb-2">
              <li>SSH 7.4</li>
              <li>Apache 2.4.29</li>
              <li>SMB Windows Server 2016</li>
              <li>MySQL 5.7.x</li>
            </ul>

            <p class="font-medium">Step 2: Manual checks</p>
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <p class="font-medium">SMB</p>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>smbclient -L \\10.10.20.5 -N</code></pre>
                <p class="text-sm">Find: public share accessible</p>
              </div>
              <div>
                <p class="font-medium">HTTP</p>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>curl -I http://10.10.20.5</code></pre>
                <p class="text-sm">Find: outdated Apache, no HSTS</p>
              </div>
              <div>
                <p class="font-medium">MySQL</p>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>mysql -h 10.10.20.5 -u root</code></pre>
                <p class="text-sm">Find: root login allowed without password (example misconfiguration)</p>
              </div>
            </div>

            <p class="font-medium">Step 3: OS Detection</p>
            <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>nmap -O 10.10.20.5</code></pre>
            <p class="text-sm">Returns: Windows Server 2016</p>

            <p class="font-medium">Step 4: Correlation</p>
            <ul class="list-disc ml-6 mb-2">
              <li>Hosts a web app</li>
              <li>Contains a database</li>
              <li>Exposes SMB</li>
              <li>Has misconfigurations</li>
              <li>Appears to be a multi-purpose server (bad practice)</li>
            </ul>
            <p class="mt-1">This produces a high-risk classification.</p>
          </div>

          <h3 class="text-lg font-semibold mt-4 mb-2">5. Red Team vs Blue Team Enumeration Perspective</h3>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <p class="font-medium mb-1">Red Team focus</p>
              <ul class="list-disc ml-6">
                <li>Fast discovery, low noise, evade controls.</li>
                <li>Confirm exploitable services and versions.</li>
                <li>Document paths that minimize detection.</li>
              </ul>
            </div>
            <div>
              <p class="font-medium mb-1">Blue Team focus</p>
              <ul class="list-disc ml-6">
                <li>Detect scan patterns and anomalies.</li>
                <li>Correlate with logs and endpoint telemetry.</li>
                <li>Harden exposed services and close gaps.</li>
              </ul>
            </div>
          </div>
        </div>
        `,
      ],
    },
  ],
});

// UI helpers
interface TabButtonProps { label: string; active: boolean; onClick: () => void; isDark: boolean; disabled?: boolean }
const TabButton = ({ label, active, onClick, isDark, disabled }: TabButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-3 font-medium transition-colors ${
      active
        ? 'border-b-2 border-blue-500 text-blue-600'
        : isDark
          ? 'text-gray-400 hover:text-white'
          : 'text-gray-600 hover:text-gray-900'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    aria-disabled={disabled ? true : undefined}
    title={disabled ? 'Disabled for this module' : undefined}
  >
    {label}
  </button>
);

// Replace ChatPanel with Beginner-style component and props
type ChatMessage = LLMChatMessage;
interface ChatPanelProps { isDark: boolean; messages: ChatMessage[]; loading: boolean; onSend: (text: string) => void }
const ChatPanel = ({ isDark, messages, loading, onSend }: ChatPanelProps) => {
  const [text, setText] = React.useState('');

  // Typing animation state for the latest assistant message
  const [typingIndex, setTypingIndex] = React.useState<number | null>(null);
  const [typedContent, setTypedContent] = React.useState('');
  const typingTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!messages.length) return;
    const lastIndex = messages.length - 1;
    const last = messages[lastIndex];

    // Start typing animation only for the newest assistant message
    if (last.role === 'assistant') {
      // If already animating this message, skip
      if (typingIndex === lastIndex && typedContent.length === last.content.length) return;

      // Clear any previous timer
      if (typingTimerRef.current) {
        window.clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }

      setTypingIndex(lastIndex);
      setTypedContent('');
      let i = 0;
      const full = last.content;
      const speedMs = 18; // smooth typing speed
      typingTimerRef.current = window.setInterval(() => {
        i = Math.min(i + 1, full.length);
        setTypedContent(full.slice(0, i));
        if (i >= full.length) {
          if (typingTimerRef.current) {
            window.clearInterval(typingTimerRef.current);
            typingTimerRef.current = null;
          }
        }
      }, speedMs);
    }

    // Cleanup when messages change or component unmounts
    return () => {
      if (typingTimerRef.current) {
        window.clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    };
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  };

  return (
    <aside className={`${isDark ? 'bg-gradient-to-br from-white/15 to-white/5 border-white/20' : 'bg-gradient-to-br from-white/70 to-white/40 border-gray-300/40'} backdrop-blur-2xl backdrop-saturate-150 w-full sticky top-0 self-start h-[calc(100vh-160px)] min-h-[520px] rounded-2xl border p-4 flex flex-col shadow-lg ring-1 ${isDark ? 'ring-white/10' : 'ring-white/60'}`
      }>
        {/* Chat Header */}
        <div className={`flex items-center justify-between pb-3 border-b ${isDark ? 'border-white/20' : 'border-[#14A38F]/30'} ${isDark ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-xl rounded-lg px-3 py-2`}>
          <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-[#14A38F]'}`}>
            Personal Teacher
          </h3>
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Ask me anything about the concepts
          </span>
        </div>

        {/* Messages List */}
        <div className={`flex-1 min-h-0 overflow-y-auto space-y-4 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
          {messages.map((msg, idx) => (
             <div key={idx} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
               <div
                 className={`${
                   msg.role === 'assistant'
                     ? isDark
                       ? 'bg-white/10 backdrop-blur-xl text-white border border-white/20'
                       : 'bg-[#14A38F] text-white border border-[#14A38F]'
                     : isDark
                     ? 'bg-black/60 backdrop-blur-xl text-white border border-white/20'
                     : 'bg-blue-600/70 backdrop-blur-xl text-white border border-blue-300/40'
                 } max-w-[85%] rounded-2xl px-4 py-3 shadow-sm whitespace-pre-wrap break-words leading-relaxed text-[15px]`}
               >
                 {msg.role === 'assistant' && idx === typingIndex && typedContent.length > 0
                   ? typedContent
                   : msg.content}
               </div>
             </div>
           ))}
         </div>
      <form onSubmit={handleSubmit} className="pt-4 border-t space-y-3">
        <div
          className={`flex items-center gap-2 ${
            isDark ? 'bg-white/10 border-white/20' : 'bg-white/60 border-gray-300/40'
          } backdrop-blur-xl rounded-xl border p-2 shadow-sm`}
        >
          <button
            type="button"
            className={`p-2 rounded ${isDark ? 'hover:bg-white/15' : 'hover:bg-white'}`}
            aria-label="Attach file"
          >
            <Paperclip className={`h-5 w-5 ${isDark ? 'text-white/80' : 'text-gray-700'}`} />
          </button>
          <button
            type="button"
            className={`p-2 rounded ${isDark ? 'hover:bg-white/15' : 'hover:bg-white'}`}
            aria-label="Voice input"
          >
            <Mic className={`h-5 w-5 ${isDark ? 'text-white/80' : 'text-gray-700'}`} />
          </button>
          <input
            type="text"
            className={`flex-1 bg-transparent outline-none ${
              isDark ? 'text-white placeholder-white/60' : 'text-gray-900 placeholder-gray-600'
            }`}
            placeholder="Type your messages..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            type="submit"
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              isDark ? 'bg-white text-gray-900' : 'bg-[#14A38F] text-white'
            } disabled:opacity-50`}
            disabled={loading}
          >
            <Send className="h-4 w-4" />
            Send Message
          </button>
        </div>
      </form>
    </aside>
  );
}

// Floating Dock (Beginner-style)
interface FloatingDockProps { isDark: boolean; onToggleTheme: () => void; onPrevModule: () => void; disabledPrev: boolean; onNextModule: () => void; disabledNext: boolean; onHome: () => void }
const FloatingDock = ({ isDark, onToggleTheme, onPrevModule, disabledPrev, onNextModule, disabledNext, onHome }: FloatingDockProps) => (
  <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-40 rounded-2xl shadow-lg border ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/60 border-gray-300/40'} backdrop-blur-xl px-3 py-2 flex items-center gap-2`} aria-label="Quick actions dock">
    <button
      onClick={onHome}
      className={`px-3 py-2 rounded-lg text-sm font-medium ${isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
      aria-label="Go to Student Portal"
      title="Student Portal"
    >
      <span className="inline-flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 10.5L12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 19.5v-9z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Home
      </span>
    </button>
    <div className="mx-1 h-6 w-px bg-gray-300/60 dark:bg-white/20" aria-hidden />
    <button
      onClick={onToggleTheme}
      className={`px-3 py-2 rounded-lg text-sm font-medium ${isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? 'Light Mode' : 'Dark Mode'}
    </button>
    <button
      onClick={onPrevModule}
      disabled={disabledPrev}
      className={`px-3 py-2 rounded-lg text-sm font-medium ${disabledPrev ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : (isDark ? 'bg-black text-white hover:bg-gray-900' : 'bg-blue-600 text-white hover:bg-blue-500')}`}
      aria-label="Go to previous module"
    >
      Previous Module
    </button>
    <button
      onClick={onNextModule}
      disabled={disabledNext}
      className={`px-3 py-2 rounded-lg text-sm font-medium ${disabledNext ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : (isDark ? 'bg-black text-white hover:bg-gray-900' : 'bg-blue-600 text-white hover:bg-blue-500')}`}
      aria-label="Go to next module"
    >
      Next Module
    </button>
  </div>
);

export default function CourseLearningNetworkingIntermediate() {
  const navigate = useNavigate();
  const { slug } = useParams(); // module slug
  const [searchParams] = useSearchParams();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [now, setNow] = useState(new Date());
  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(timer); }, []);

  // Find current module and first topic
  const moduleIndex = useMemo(() => MODULES.findIndex((m) => m.id === (slug || 'module-1')), [slug]);
  const currentModule = MODULES[moduleIndex] || MODULES[0];
  const [activeTopicId, setActiveTopicId] = useState<string>(currentModule.topics[0].id);
  const [activeTab, setActiveTab] = useState<'lesson' | 'syntax' | 'terminal'>('lesson');
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const sendChat = async (text: string) => {
    const userMsg: ChatMessage = { role: 'user', content: text };
    setChatMessages(prev => [...prev, userMsg]);
    setChatLoading(true);
    try {
      const answer = await askLLM(text, [...chatMessages, userMsg]);
      setChatMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I could not reach the assistant. Please try again.' }]);
      console.error('Chat error:', err);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    // Reset topic state when module changes; support deep links across modules
    const qpTopic = searchParams.get('topic');
    const qpTab = searchParams.get('tab') as ('lesson' | 'syntax' | 'terminal') | null;
    const qpPageRaw = searchParams.get('page');
    const qpPage = qpPageRaw ? Math.max(0, parseInt(qpPageRaw, 10) || 0) : 0;

    if (qpTopic) {
      // If the requested topic belongs to a different module, navigate there
      const moduleWithTopic = MODULES.find(m => m.topics.some(t => t.id === qpTopic));
      if (moduleWithTopic && moduleWithTopic.id !== currentModule.id) {
        const params = new URLSearchParams();
        params.set('topic', qpTopic);
        if (qpTab) params.set('tab', qpTab);
        if (qpPage > 0) params.set('page', String(qpPage));
        navigate(`/networking-intermediate/module/${moduleWithTopic.id}?${params.toString()}`, { replace: true });
        return; // let next render in the correct module handle state
      }

      // Topic exists in current module
      const validTopic = currentModule.topics.find(t => t.id === qpTopic)?.id || currentModule.topics[0].id;
      setActiveTopicId(validTopic);
    } else {
      // No topic specified: default to first topic
      setActiveTopicId(currentModule.topics[0].id);
    }

    // Tab and page defaults
    setActiveTab(qpTab === 'syntax' || qpTab === 'terminal' ? qpTab : 'lesson');
    setPageIndex(qpPage);
  }, [currentModule.id, searchParams]);

  const activeTopic = useMemo(() => currentModule.topics.find((t) => t.id === activeTopicId), [currentModule, activeTopicId]);

  // Guard: during module change first render may have no activeTopic
  if (!activeTopic) {
    return null;
  }

  // Prev/Next module handlers (disabled for now if not present)
  const prevModule = MODULES[moduleIndex - 1];
  const nextModule = MODULES[moduleIndex + 1];
  const onPrevModule = () => {
    if (!prevModule) return;
    navigate(`/networking-intermediate/module/${prevModule.id}`);
  };
  const onNextModule = () => {
    if (!nextModule) return;
    navigate(`/networking-intermediate/module/${nextModule.id}`);
  };

  const bgClass = theme === 'dark' ? 'bg-gradient-to-b from-neutral-900 to-black text-white' : 'bg-gradient-to-b from-slate-100 to-white text-black';

  return (
    <main className={`min-h-screen ${bgClass} pb-16`}>
      {/* Header strip */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 pt-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold">{currentModule.title}</h1>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded-md border border-white/20 bg-white/10 text-white hover:bg-white/20"
              onClick={() => navigate('/student-portal')}
            >
              Back to Portal
            </button>
            <button
              className={`px-3 py-1 rounded-md ${prevModule ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-neutral-700/40 text-white cursor-not-allowed'} border border-white/20`}
              onClick={onPrevModule}
              disabled={!prevModule}
            >
              Prev Module
            </button>
            <button
              className={`px-3 py-1 rounded-md ${nextModule ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-neutral-700/40 text-white cursor-not-allowed'} border border-white/20`}
              onClick={onNextModule}
              disabled={!nextModule}
            >
              Next Module
            </button>
            {currentModule.id !== 'module-1' && (
              <button
                className="px-3 py-1 rounded-md border border-white/20 bg-white/10 text-white hover:bg-white/20"
                onClick={() => navigate('/networking-intermediate/module/module-1?topic=interfaces-links-routes')}
                title="Jump to Networking – Intermediate Topic 2"
              >
                Go to Topic 2 (Interfaces)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Floating Dock */}
      <FloatingDock
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onPrevModule={onPrevModule}
        disabledPrev={!prevModule}
        onNextModule={onNextModule}
        disabledNext={!nextModule}
        onHome={() => navigate('/student-portal')}
      />

      {/* Body layout */}
      <div className="w-full flex pt-6">
        {/* Sidebar: topics list */}
        <aside className={`${isDark ? 'bg-black border-gray-700' : 'bg-[#FDF7EC] border-gray-200'} border-r w-96 p-4`}>
           <div className="flex items-center justify-between mb-4">
             <button
              onClick={() => navigate('/student-portal')}
              className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors text-sm`}
              aria-label="Back to portal"
            >
              Back to Portal
            </button>
          </div>
          <h2 className="text-sm font-semibold mb-3">{currentModule.title}</h2>
          <ul className="space-y-2">
            {currentModule.topics.map((t, idx) => (
              <li key={t.id}>
                <button
                  onClick={() => { setActiveTopicId(t.id); setPageIndex(0); setActiveTab('lesson'); }}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    t.id === activeTopicId
                      ? (isDark ? 'bg-black text-white' : 'bg-[#14A38F] text-white')
                      : isDark
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-700 hover:bg-[#F3EAD7]'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`${t.id === activeTopicId ? (isDark ? 'bg-black text-white' : 'bg-[#14A38F] text-white') : (isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700')} w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3`}>
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-medium">{t.title}</div>
                      <div className="text-xs opacity-75">Lesson {idx + 1}</div>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content */}
        <section className="rounded-lg border border-white/15 bg-white/5 p-4 flex-1">
          {/* Top Bar: Tabs + Date/Time */}
          <div className={`flex items-center justify-between mb-4 border-b ${isDark ? 'border-white/15' : 'border-gray-200'} pb-2`}>
            <div className="flex items-center gap-2">
              <TabButton label="Lesson" active={activeTab === 'lesson'} onClick={() => setActiveTab('lesson')} isDark={isDark} />
              <TabButton label="Syntax" active={activeTab === 'syntax'} onClick={() => setActiveTab('syntax')} isDark={isDark} />
              <TabButton label="Terminal" active={activeTab === 'terminal'} onClick={() => setActiveTab('terminal')} isDark={isDark} />
            </div>
            <div className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{now.toLocaleDateString()} {now.toLocaleTimeString()}</div>
          </div>

          {/* Two-column layout with Personal Teacher chat */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_480px] gap-4">
            {/* Left: main content per tab */}
            <div>
              {/* Lesson pages */}
              {activeTab === 'lesson' && (
                <div className={`${isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg`}>
                  <div className="prose dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: activeTopic.theoryPages[pageIndex] }} />
                  </div>
                  <div className="flex justify-between mt-6">
                    <button
                      className={`px-3 py-1 rounded-md ${pageIndex > 0 ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-neutral-700/40 text-white cursor-not-allowed'} border border-white/20`}
                      disabled={pageIndex === 0}
                      onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                    >Prev Page</button>
                    <button
                      className={`px-3 py-1 rounded-md ${pageIndex < activeTopic.theoryPages.length - 1 ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-neutral-700/40 text-white cursor-not-allowed'} border border-white/20`}
                      disabled={pageIndex >= activeTopic.theoryPages.length - 1}
                      onClick={() => setPageIndex((p) => Math.min(activeTopic.theoryPages.length - 1, p + 1))}
                    >Next Page</button>
                  </div>
                </div>
              )}

              {/* Syntax */}
              {activeTab === 'syntax' && (
                activeTopic.syntaxPages && activeTopic.syntaxPages.length > 0 ? (
                  <div className={`${isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg`}>
                    <div className="prose dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: activeTopic.syntaxPages[pageIndex] }} />
                    </div>
                    <div className="flex justify-between mt-6">
                      <button
                        className={`px-3 py-1 rounded-md ${pageIndex > 0 ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-neutral-700/40 text-white cursor-not-allowed'} border border-white/20`}
                        disabled={pageIndex === 0}
                        onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                      >Prev Page</button>
                      <button
                        className={`px-3 py-1 rounded-md ${pageIndex < (activeTopic.syntaxPages?.length || 0) - 1 ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-neutral-700/40 text-white cursor-not-allowed'} border border-white/20`}
                        disabled={pageIndex >= (activeTopic.syntaxPages?.length || 0) - 1}
                        onClick={() => setPageIndex((p) => Math.min((activeTopic.syntaxPages?.length || 0) - 1, p + 1))}
                      >Next Page</button>
                    </div>
                  </div>
                ) : activeTopic.id === 'interfaces-links-routes' ? (
                  <div className="space-y-6">
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">1) Network Interfaces</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`# View all interfaces and addresses
ip a

# Enable/disable an interface
ip link set eth0 up
ip link set eth0 down

# Set MTU
ip link set eth0 mtu 1400

# Change MAC address
ip link set eth0 address 00:11:22:33:44:55

# Add IP to an interface
ip addr add 192.168.50.10/24 dev eth0

# Remove IP from an interface
ip addr del 192.168.50.10/24 dev eth0`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">2) Links (Layer 2)</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`# Show link details
ip link show

# Rename interface
ip link set eth0 name lan0

# Create a dummy interface (virtual link)
ip link add dummy0 type dummy
ip link set dummy0 up`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">3) Routes</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`# View routing table
ip route show

# Add a static route
ip route add 10.10.0.0/16 via 192.168.1.1 dev eth0

# Delete a route
ip route del 10.10.0.0/16

# Add default gateway
ip route add default via 192.168.1.1

# Replace default route
ip route replace default via 192.168.1.1`}</code></pre>
                    </div>
                  </div>
                ) : activeTopic.id === 'static-dynamic-routing' ? (
                  <div className="space-y-6">
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">View route table</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ip route show
route -n`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Add static route</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ip route add 10.10.0.0/16 via 192.168.1.1 dev eth0`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Delete static route</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ip route del 10.10.0.0/16`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Set default route</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ip route add default via 192.168.1.1`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Replace default route</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ip route replace default via 192.168.1.1`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Enable dynamic routing (FRRouting)</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`# Install FRR
sudo apt install frr frr-pythontools

# Enable OSPF
vtysh
router ospf
 network 10.0.0.0/8 area 0`}</code></pre>
                    </div>
                  </div>
                ) : activeTopic.id === 'network-namespaces-virtual-interfaces' ? (
                  <div className="space-y-6">
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Namespace Management</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`# List namespaces
ip netns list

# Create namespace
ip netns add ns1

# Delete namespace
ip netns delete ns1

# Run command inside namespace
ip netns exec ns1 ip a
ip netns exec ns1 bash`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Create veth Pair</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`# Create veth pair
ip link add veth0 type veth peer name veth1

# Move veth1 to namespace
ip link set veth1 netns ns1`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Assign IPs & Bring Interfaces Up</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`# Outside namespace
ip addr add 10.1.1.1/24 dev veth0
ip link set veth0 up

# Inside namespace
ip netns exec ns1 ip addr add 10.1.1.2/24 dev veth1
ip netns exec ns1 ip link set veth1 up
ip netns exec ns1 ip link set lo up`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Test Connectivity</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ip netns exec ns1 ping 10.1.1.1`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Bridges</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`# Create bridge
ip link add br0 type bridge
ip link set br0 up

# Add veth to bridge
ip link set veth0 master br0`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Dummy Interface</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`# Create dummy interface
ip link add dummy0 type dummy
ip addr add 192.168.100.1/32 dev dummy0
ip link set dummy0 up`}</code></pre>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">IFCONFIG (Legacy)</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`# View all interfaces
ifconfig

# Bring interface up/down
ifconfig eth0 up
ifconfig eth0 down

# Assign IP address
ifconfig eth0 192.168.1.10 netmask 255.255.255.0

# Change MTU
ifconfig eth0 mtu 1400`}</code></pre>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">IP COMMAND (Modern)</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`# View interfaces
ip a
ip link show

# Assign IP address
ip addr add 192.168.1.20/24 dev eth0

# Remove IP address
ip addr del 192.168.1.20/24 dev eth0

# Enable/disable interface
ip link set eth0 up
ip link set eth0 down

# View routing table
ip route show

# Add static route
ip route add 10.0.0.0/24 via 192.168.1.1 dev eth0

# Delete route
ip route del 10.0.0.0/24 via 192.168.1.1

# Show ARP table
ip neigh show`}</code></pre>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">NMCLI (NetworkManager CLI)</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`# Show device status
nmcli device status

# Show connections
nmcli connection show

# Assign static IP to a connection
nmcli con mod "Wired connection 1" ipv4.addresses 192.168.1.30/24
nmcli con mod "Wired connection 1" ipv4.gateway 192.168.1.1
nmcli con mod "Wired connection 1" ipv4.dns 8.8.8.8
nmcli con mod "Wired connection 1" ipv4.method manual

# Enable/disable a device
nmcli device disconnect eth0
nmcli device connect eth0

# Reload NetworkManager
nmcli networking off
nmcli networking on

# Restart a connection
nmcli con down "Wired connection 1"
nmcli con up "Wired connection 1"`}</code></pre>
                    </div>
                  </div>
                )
              )}

              {/* Terminal */}
              {activeTab === 'terminal' && (
                activeTopic.id === 'interfaces-links-routes' ? (
                  <div className="space-y-6">
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">1) Verify interfaces & addresses</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ip a
ip link`}</code></pre>
                    </div>
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">2) Check routing</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ip route`}</code></pre>
                    </div>
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">3) Bring interface up & assign IP</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`sudo ip link set eth0 up
sudo ip addr add 10.0.1.50/24 dev eth0`}</code></pre>
                    </div>
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">4) Test Layer 2 connectivity (ARP)</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ip neigh
ping -c 1 10.0.1.1
ip neigh`}</code></pre>
                    </div>
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">5) Add a temporary route</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`sudo ip route add 172.16.0.0/24 via 10.0.1.1 dev eth0`}</code></pre>
                    </div>
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">6) Verify routing</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ip route show`}</code></pre>
                    </div>
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">7) Delete interface IP</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`sudo ip addr flush dev eth0`}</code></pre>
                    </div>
                  </div>
                ) : activeTopic.id === 'static-dynamic-routing' ? (
                  <div className="space-y-6">
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">1) Add IPs and test connectivity</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ip addr add 192.168.50.10/24 dev eth0
ping 192.168.50.1`}</code></pre>
                    </div>
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">2) Add a static route</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ip route add 172.16.0.0/24 via 192.168.50.1 dev eth0`}</code></pre>
                    </div>
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">3) Verify route</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ip route`}</code></pre>
                    </div>
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">4) Enable FRR and inspect dynamic routes</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`sudo systemctl enable frr --now
vtysh -c "show ip route"`}</code></pre>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-md overflow-hidden border border-white/20">
                    <iframe
                      title="terminal"
                      src="https://copy.sh/v86/?profile=archlinux&options=cdrom,bios&cdrom=https://dl-cdn.alpinelinux.org/alpine/v3.18/releases/x86_64/alpine-standard-3.18.0-x86_64.iso"
                      className="w-full h-[500px] bg-black"
                    />
                  </div>
                )
              )}
            </div>

            {/* Right: Personal Teacher chat */}
            <div className="w-full xl:w-[480px] shrink-0"><ChatPanel isDark={isDark} messages={chatMessages} loading={chatLoading} onSend={sendChat} /></div>
          </div>
        </section>
      </div>
    </main>
  );
}