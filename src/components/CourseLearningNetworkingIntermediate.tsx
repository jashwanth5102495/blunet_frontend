import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { askLLM, ChatMessage as LLMChatMessage } from '../services/llm';
import { Paperclip, Mic, Send } from 'lucide-react';

interface TopicPage {
  id: string;
  title: string;
  theoryPages: string[];
  syntaxPages?: string[];
}

interface ModuleData {
  id: string;
  title: string;
  topics: TopicPage[];
}

const MODULES: ModuleData[] = [
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
},
{
  id: 'module-3',
      title: 'Module 3: Linux-Based Firewall & Security Devices',
      topics: [
        {
          id: 'iptables-config',
          title: 'iptables deep configuration',
          theoryPages: [
            `<div>
              <h2 class="text-xl font-semibold mb-3">What is iptables?</h2>
              <p class="mb-3">iptables is a packet filtering and NAT firewall framework built directly into the Linux kernel using netfilter. It allows system administrators to control incoming, outgoing, and forwarded network traffic based on rules defined for packets.</p>
              <p class="mb-3">Unlike basic firewalls that only allow or block ports, iptables works at a deep packet level, enabling filtering based on:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Source and destination IP</li>
                <li>Port numbers</li>
                <li>Protocols (TCP, UDP, ICMP)</li>
                <li>Connection state</li>
                <li>Interfaces</li>
                <li>Packet flags</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">How iptables Works Internally</h2>
              <p class="mb-3">iptables processes packets through a series of tables, chains, and rules.</p>

              <h3 class="text-lg font-semibold mb-2">1. Tables</h3>
              <p class="mb-3">Tables define what kind of action will be taken on packets.</p>
              <div class="overflow-x-auto mb-3">
                <table class="min-w-full text-sm text-left border border-gray-700">
                  <thead class="bg-gray-800 text-white">
                    <tr><th class="px-4 py-2 border border-gray-600">Table</th><th class="px-4 py-2 border border-gray-600">Purpose</th></tr>
                  </thead>
                  <tbody>
                    <tr class="border border-gray-600"><td>filter</td><td>Default table, used for packet filtering (ALLOW/DROP)</td></tr>
                    <tr class="border border-gray-600"><td>nat</td><td>Used for Network Address Translation</td></tr>
                    <tr class="border border-gray-600"><td>mangle</td><td>Used for packet modification</td></tr>
                    <tr class="border border-gray-600"><td>raw</td><td>Used to disable connection tracking</td></tr>
                    <tr class="border border-gray-600"><td>security</td><td>Used with SELinux policies</td></tr>
                  </tbody>
                </table>
              </div>
              <p class="mb-3">Most firewall rules are written in the <strong>filter</strong> and <strong>nat</strong> tables.</p>

              <h3 class="text-lg font-semibold mb-2">2. Chains</h3>
              <p class="mb-3">Chains define when a rule is applied.</p>
              <div class="overflow-x-auto mb-3">
                <table class="min-w-full text-sm text-left border border-gray-700">
                  <thead class="bg-gray-800 text-white">
                    <tr><th class="px-4 py-2 border border-gray-600">Chain</th><th class="px-4 py-2 border border-gray-600">Description</th></tr>
                  </thead>
                  <tbody>
                    <tr class="border border-gray-600"><td>INPUT</td><td>Traffic coming into the system</td></tr>
                    <tr class="border border-gray-600"><td>OUTPUT</td><td>Traffic going out of the system</td></tr>
                    <tr class="border border-gray-600"><td>FORWARD</td><td>Traffic passing through the system</td></tr>
                    <tr class="border border-gray-600"><td>PREROUTING</td><td>Before routing decision (NAT)</td></tr>
                    <tr class="border border-gray-600"><td>POSTROUTING</td><td>After routing decision (NAT)</td></tr>
                  </tbody>
                </table>
              </div>

              <h3 class="text-lg font-semibold mb-2">3. Rules</h3>
              <p class="mb-3">Rules are evaluated top-down. The first matching rule wins.</p>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>Match conditions:</strong> IP, port, protocol</li>
                <li><strong>Target:</strong> ACCEPT, DROP, REJECT, LOG, DNAT, SNAT</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Packet Flow in iptables</h2>
              <p class="mb-3">Understanding packet flow is critical for advanced firewall configuration.</p>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>Incoming packet flow:</strong> PREROUTING → INPUT → Local Process</li>
                <li><strong>Outgoing packet flow:</strong> Local Process → OUTPUT → POSTROUTING</li>
                <li><strong>Forwarded packet flow:</strong> PREROUTING → FORWARD → POSTROUTING</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Connection Tracking (Stateful Firewall)</h2>
              <p class="mb-3">iptables uses <code>conntrack</code> to maintain session states.</p>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>NEW:</strong> The packet has started a new connection.</li>
                <li><strong>ESTABLISHED:</strong> The packet is associated with a connection which has seen packets in both directions.</li>
                <li><strong>RELATED:</strong> The packet is starting a new connection, but is associated with an existing connection (e.g., FTP data transfer).</li>
                <li><strong>INVALID:</strong> The packet is not associated with a known connection.</li>
              </ul>
              <p class="mb-3">Stateful rules allow secure behavior like allowing responses to outbound connections while blocking unsolicited inbound packets.</p>

              <h2 class="text-xl font-semibold mb-3">Default Policy Concept</h2>
              <p class="mb-3">Every chain has a default policy:</p>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>ACCEPT:</strong> Allow everything unless blocked.</li>
                <li><strong>DROP:</strong> Deny everything unless allowed.</li>
              </ul>
              <p class="mb-3">For security, <strong>DROP by default, allow explicitly</strong> is best practice.</p>

              <h2 class="text-xl font-semibold mb-3">Why iptables is Still Important</h2>
              <p class="mb-3">Even though newer tools exist:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>iptables is still widely used in servers.</li>
                <li>Many firewalls (firewalld, UFW) are wrappers around iptables.</li>
                <li>Essential for security engineers and network admins.</li>
                <li>Used in routers, gateways, VPN servers, cloud VMs.</li>
              </ul>
            </div>`
          ],
          syntaxPages: [
            `<div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-2">Basic Command Structure</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>iptables [TABLE] COMMAND CHAIN MATCH TARGET</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">View Existing Rules</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>iptables -L
iptables -L -v
iptables -L -n
iptables -t nat -L</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Set Default Policies</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>iptables -P INPUT DROP
iptables -P OUTPUT ACCEPT
iptables -P FORWARD DROP</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Allow Loopback Traffic</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Allow Established Connections</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Allow SSH Access</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>iptables -A INPUT -p tcp --dport 22 -m state --state NEW -j ACCEPT</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Block an IP Address</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>iptables -A INPUT -s 192.168.1.100 -j DROP</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Allow HTTP & HTTPS</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Delete a Rule</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>iptables -D INPUT 3</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Flush All Rules</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>iptables -F
iptables -t nat -F</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Save Rules (Persistence)</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>iptables-save > /etc/iptables.rules</code></pre>
              </div>
            </div>`
          ]
        },
        {
          id: 'nat-dnat-snat',
          title: 'NAT, DNAT, SNAT, MASQUERADE rules',
          theoryPages: [
            `<div>
              <h2 class="text-xl font-semibold mb-3">Why NAT Exists</h2>
              <p class="mb-3">Modern networks rely heavily on private IP addressing (RFC 1918) such as:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>192.168.0.0/16</li>
                <li>10.0.0.0/8</li>
                <li>172.16.0.0/12</li>
              </ul>
              <p class="mb-3">These IPs cannot be routed on the public internet. NAT was introduced to:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Conserve IPv4 addresses</li>
                <li>Allow internal networks to communicate externally</li>
                <li>Add a basic layer of obscurity/security</li>
                <li>Enable multi-device internet access with a single public IP</li>
              </ul>
              <p class="mb-3">Linux implements NAT using <strong>netfilter</strong>, controlled via the <strong>iptables NAT table</strong>.</p>

              <h2 class="text-xl font-semibold mb-3">Understanding NAT at Packet Level</h2>
              <p class="mb-3">When NAT is applied, the firewall modifies packet headers, not payload data. Fields modified:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Source IP</li>
                <li>Destination IP</li>
                <li>Source Port</li>
                <li>Destination Port</li>
              </ul>
              <p class="mb-3">Connection tracking ensures return traffic is mapped correctly, maintaining session integrity.</p>

              <h2 class="text-xl font-semibold mb-3">SNAT (Source Network Address Translation)</h2>
              <p class="mb-3"><strong>Purpose:</strong> SNAT modifies the source IP address of outgoing packets.</p>
              <p class="mb-2 font-medium">Where it is used:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Enterprise gateways</li>
                <li>Data centers with static public IPs</li>
                <li>Internet-facing Linux routers</li>
              </ul>
              <p class="mb-3"><strong>Why static IP is required:</strong> SNAT rules explicitly define the public IP. If the IP changes, connections break.</p>
              <div class="bg-gray-800 text-gray-200 p-3 rounded-md mb-3">
                <p class="font-mono text-sm">Client: 192.168.1.10 → Google</p>
                <p class="font-mono text-sm">After SNAT: 203.0.113.5 → Google</p>
              </div>
              <p class="mb-3">Return traffic is translated back automatically. <strong>Chain Used:</strong> POSTROUTING</p>

              <h2 class="text-xl font-semibold mb-3">MASQUERADE (Dynamic SNAT)</h2>
              <p class="mb-3">MASQUERADE is SNAT with intelligence. Used when:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Public IP is assigned dynamically</li>
                <li>ISP uses DHCP</li>
                <li>Mobile broadband / cloud VMs</li>
              </ul>
              <h3 class="text-lg font-semibold mb-2">Key Difference from SNAT:</h3>
              <div class="overflow-x-auto mb-3">
                <table class="min-w-full text-sm text-left border border-gray-700">
                  <thead class="bg-gray-800 text-white">
                    <tr><th class="px-4 py-2 border border-gray-600">SNAT</th><th class="px-4 py-2 border border-gray-600">MASQUERADE</th></tr>
                  </thead>
                  <tbody>
                    <tr class="border border-gray-600"><td>Static IP required</td><td>Dynamic IP supported</td></tr>
                    <tr class="border border-gray-600"><td>Faster</td><td>Slightly slower</td></tr>
                    <tr class="border border-gray-600"><td>Manual IP config</td><td>Automatic IP detection</td></tr>
                  </tbody>
                </table>
              </div>
              <p class="mb-3">MASQUERADE recalculates IP for every connection, making it flexible but slightly heavier.</p>
            </div>`,
            `<div>
              <h2 class="text-xl font-semibold mb-3">DNAT (Destination Network Address Translation)</h2>
              <p class="mb-3"><strong>Purpose:</strong> DNAT modifies the destination IP or port of incoming packets.</p>
              <p class="mb-2 font-medium">Primary use case:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Port forwarding</li>
                <li>Publishing internal services</li>
                <li>Reverse proxy scenarios</li>
              </ul>

              <h3 class="text-lg font-semibold mb-2">Example Scenario:</h3>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>Public IP:</strong> 203.0.113.5</li>
                <li><strong>Internal Web Server:</strong> 192.168.1.20</li>
              </ul>
              <div class="bg-gray-800 text-gray-200 p-3 rounded-md mb-3">
                <p class="font-mono text-sm">Traffic: 203.0.113.5:80 → 192.168.1.20:80</p>
              </div>
              <p class="mb-3"><strong>Chain Used:</strong> PREROUTING</p>

              <h2 class="text-xl font-semibold mb-3">Complete NAT Packet Journey</h2>
              <div class="bg-gray-800 text-gray-200 p-4 rounded-md mb-3 font-mono text-sm">
                Incoming Packet<br/>
                → PREROUTING (DNAT)<br/>
                → FORWARD<br/>
                → POSTROUTING (SNAT / MASQUERADE)<br/>
                → Outgoing Interface
              </div>
              <p class="mb-3">Understanding this flow is critical for troubleshooting NAT issues.</p>

              <h2 class="text-xl font-semibold mb-3">Enterprise Use Cases</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>ISPs sharing internet access</li>
                <li>Cloud VM gateways</li>
                <li>Kubernetes node networking</li>
                <li>VPN concentrators</li>
                <li>Home & enterprise routers</li>
              </ul>
            </div>`
          ],
          syntaxPages: [
            `<div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-2">Enable forwarding</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>echo 1 > /proc/sys/net/ipv4/ip_forward</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">SNAT</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>iptables -t nat -A POSTROUTING -s 192.168.1.0/24 -o eth0 -j SNAT --to-source 203.0.113.5</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">MASQUERADE</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">DNAT</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to 192.168.1.20:80</code></pre>
              </div>
            </div>`
          ]
        },
        {
          id: 'firewalld-zones',
          title: 'firewalld zones, policies, and rich rules',
          theoryPages: [
            `<div>
              <h2 class="text-xl font-semibold mb-3">Why firewalld Was Introduced</h2>
              <p class="mb-3">Traditional iptables required rule reloads, full firewall restarts, and carried a risk of SSH lockouts.</p>
              <p class="mb-3"><strong>firewalld solves this by introducing:</strong></p>
              <ul class="list-disc ml-6 mb-3">
                <li>Dynamic rule changes</li>
                <li>Abstracted security models</li>
                <li>Zone-based trust management</li>
              </ul>
              <p class="mb-3"><em>firewalld is a controller, not a firewall engine itself. It manages iptables or nftables underneath.</em></p>

              <h2 class="text-xl font-semibold mb-3">Zones – Trust-Based Security Model</h2>
              <p class="mb-3">Zones represent how much you trust a network. Instead of thinking <em>"Which port should I block?"</em>, you think <em>"How much do I trust this interface?"</em></p>

              <h3 class="text-lg font-semibold mb-2">Zone Examples Explained</h3>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>public</strong> → Coffee shop Wi-Fi</li>
                <li><strong>home</strong> → Personal LAN</li>
                <li><strong>internal</strong> → Corporate network</li>
                <li><strong>dmz</strong> → Public-facing servers</li>
                <li><strong>trusted</strong> → No filtering</li>
              </ul>
              <p class="mb-3">Each zone has predefined behavior, reducing human error.</p>

              <h2 class="text-xl font-semibold mb-3">Services vs Ports</h2>
              <p class="mb-3">firewalld works with services, not raw ports. This improves readability and maintainability.</p>
              <div class="bg-gray-800 text-gray-200 p-3 rounded-md mb-3">
                <p class="font-mono text-sm">http → 80/tcp</p>
                <p class="font-mono text-sm">https → 443/tcp</p>
                <p class="font-mono text-sm">ssh → 22/tcp</p>
              </div>

              <h2 class="text-xl font-semibold mb-3">Rich Rules – Advanced Control</h2>
              <p class="mb-3">Rich rules allow source IP filtering, logging, reject messages, rate limiting, and protocol-specific actions. They bring iptables-level power with better readability.</p>

              <h2 class="text-xl font-semibold mb-3">Permanent vs Runtime Configuration</h2>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>Runtime</strong> → Lost on reboot</li>
                <li><strong>Permanent</strong> → Saved to disk</li>
              </ul>
              <p class="mb-3 font-medium">Best practice:</p>
              <ol class="list-decimal ml-6 mb-3">
                <li>Test in runtime</li>
                <li>Apply permanently</li>
                <li>Reload</li>
              </ol>
            </div>`
          ],
          syntaxPages: [
            `<div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-2">Get Active Zones</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>firewall-cmd --get-active-zones</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Set Default Zone</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>firewall-cmd --set-default-zone=public</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Add Service (Permanent)</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>firewall-cmd --zone=dmz --add-service=http --permanent</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Reload Configuration</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>firewall-cmd --reload</code></pre>
              </div>
            </div>`
          ]
        },
        {
          id: 'ufw-management',
          title: 'ufw for simplified firewall management',
          theoryPages: [
            `<div>
              <h2 class="text-xl font-semibold mb-3">Introduction to UFW</h2>
              <p class="mb-3">UFW (Uncomplicated Firewall) is a high-level firewall management tool designed to make Linux firewall configuration simple, readable, and less error-prone, especially for users who are new to complex packet filtering systems like iptables.</p>
              <p class="mb-3">UFW acts as a frontend (wrapper) for iptables. This means:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>UFW does not replace iptables</li>
                <li>It automatically generates iptables rules</li>
                <li>All rules enforced by UFW ultimately run inside the Linux kernel via netfilter</li>
              </ul>
              <p class="mb-3">UFW is most commonly used in:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Ubuntu servers</li>
                <li>Cloud virtual machines (AWS, Azure, GCP)</li>
                <li>Developer environments</li>
                <li>Small to medium production servers</li>
              </ul>
              
              <h2 class="text-xl font-semibold mb-3">Why UFW Was Created</h2>
              <p class="mb-3">iptables, while extremely powerful, has several challenges:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Long and complex command syntax</li>
                <li>High risk of misconfiguration</li>
                <li>Easy to lock yourself out of SSH</li>
                <li>Difficult to audit rules visually</li>
              </ul>
              <p class="mb-3">UFW was created to:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Reduce human error</li>
                <li>Enforce secure defaults</li>
                <li>Make firewall management accessible</li>
                <li>Speed up server hardening</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">UFW Design Philosophy</h2>
              <p class="mb-3">UFW follows a security-first philosophy based on three core principles:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Deny by default</li>
                <li>Allow only what is required</li>
                <li>Keep rules readable and minimal</li>
              </ul>
              <p class="mb-3">This aligns closely with Zero Trust Security, where no traffic is trusted unless explicitly permitted.</p>

              <h2 class="text-xl font-semibold mb-3">Default Firewall Behavior in UFW</h2>
              <p class="mb-3">When UFW is enabled:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Incoming traffic → Blocked by default</li>
                <li>Outgoing traffic → Allowed by default</li>
                <li>Forwarded traffic → Blocked unless configured</li>
              </ul>
              <p class="mb-3">This model ensures:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Protection against unsolicited inbound attacks</li>
                <li>Normal system operations remain unaffected</li>
                <li>Reduced attack surface</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Rule Abstraction in UFW</h2>
              <p class="mb-3">Instead of writing low-level iptables rules, UFW uses human-readable commands.</p>
              <div class="grid sm:grid-cols-2 gap-4 mb-3">
                <div>
                  <p class="font-medium mb-1">iptables</p>
                  <pre class="bg-black/60 text-white rounded-md p-2 overflow-auto text-xs"><code>iptables -A INPUT -p tcp --dport 22 -m state --state NEW -j ACCEPT</code></pre>
                </div>
                <div>
                  <p class="font-medium mb-1">ufw</p>
                  <pre class="bg-black/60 text-white rounded-md p-2 overflow-auto text-xs"><code>ufw allow ssh</code></pre>
                </div>
              </div>
              <p class="mb-3">This abstraction makes UFW easier to learn, faster to deploy, and safer for beginners.</p>
            </div>`,
            `<div>
              <h2 class="text-xl font-semibold mb-3">Port-Based vs Application-Based Rules</h2>
              <p class="mb-3">UFW supports two types of rules:</p>
              <h3 class="text-lg font-semibold mb-2">1. Port-Based Rules</h3>
              <p class="mb-2">Allow or deny traffic based on port numbers.</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Allow port 80 (HTTP)</li>
                <li>Block port 21 (FTP)</li>
              </ul>
              <h3 class="text-lg font-semibold mb-2">2. Application Profiles</h3>
              <p class="mb-2">Applications can register predefined firewall profiles (e.g., OpenSSH, Apache, Nginx). Each profile contains required ports, protocols, and a description. This avoids mistakes like opening wrong ports or forgetting required services.</p>

              <h2 class="text-xl font-semibold mb-3">Application Profiles Explained</h2>
              <p class="mb-3">Application profiles are stored in <code>/etc/ufw/applications.d/</code>. Each profile defines the application name, description, and required ports.</p>
              <pre class="bg-black/60 text-white rounded-md p-3 mb-3 overflow-auto text-sm"><code>[OpenSSH]
title=OpenSSH Server
description=Secure shell server
ports=22/tcp</code></pre>
              <p class="mb-3">Using profiles improves security consistency, rule readability, and maintenance.</p>

              <h2 class="text-xl font-semibold mb-3">Rule Ordering and Processing</h2>
              <p class="mb-3">UFW processes rules in a top-down manner, similar to iptables:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>First matching rule is applied</li>
                <li>More specific rules should be defined before generic ones</li>
                <li>Deny rules can override allow rules</li>
              </ul>
              <p class="mb-3">However, UFW automatically manages rule ordering internally, reducing complexity for users.</p>

              <h2 class="text-xl font-semibold mb-3">Logging in UFW</h2>
              <p class="mb-3">UFW supports built-in logging to track blocked packets, allowed connections, and suspicious activity. Logs are written to <code>/var/log/ufw.log</code>.</p>
              <p class="mb-3">Logging levels: low, medium, high, full.</p>
              <p class="mb-3">Logging is critical for incident response, security auditing, and troubleshooting connectivity issues.</p>

              <h2 class="text-xl font-semibold mb-3">Rate Limiting with UFW</h2>
              <p class="mb-3">UFW supports basic rate limiting, especially useful for SSH protection to prevent brute-force attacks and reduce automated login attempts.</p>
              <p class="mb-3">Example: Limit SSH login attempts per IP and automatically block repeated requests. This adds a lightweight intrusion prevention mechanism without extra tools.</p>

              <h2 class="text-xl font-semibold mb-3">IPv4 and IPv6 Support</h2>
              <p class="mb-3">UFW supports both IPv4 and IPv6. By default, IPv6 rules are enabled if the system supports IPv6. This is important because many attacks target IPv6 misconfigurations.</p>

              <h2 class="text-xl font-semibold mb-3">UFW vs firewalld vs iptables</h2>
              <div class="overflow-x-auto mb-3">
                <table class="min-w-full text-sm text-left">
                  <thead class="bg-white/10">
                    <tr>
                      <th class="p-2">Feature</th>
                      <th class="p-2">UFW</th>
                      <th class="p-2">firewalld</th>
                      <th class="p-2">iptables</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b border-white/10">
                      <td class="p-2">Ease of use</td>
                      <td class="p-2">Very high</td>
                      <td class="p-2">Medium</td>
                      <td class="p-2">Low</td>
                    </tr>
                    <tr class="border-b border-white/10">
                      <td class="p-2">Granularity</td>
                      <td class="p-2">Medium</td>
                      <td class="p-2">High</td>
                      <td class="p-2">Very high</td>
                    </tr>
                    <tr class="border-b border-white/10">
                      <td class="p-2">Dynamic changes</td>
                      <td class="p-2">Limited</td>
                      <td class="p-2">Yes</td>
                      <td class="p-2">No</td>
                    </tr>
                    <tr>
                      <td class="p-2">Best for</td>
                      <td class="p-2">Ubuntu, cloud</td>
                      <td class="p-2">RHEL-based</td>
                      <td class="p-2">Advanced admins</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 class="text-xl font-semibold mb-3">When NOT to Use UFW</h2>
              <p class="mb-3">UFW is not ideal for complex NAT configurations, advanced routing scenarios, large enterprise gateways, or multi-zone security architectures. In such cases, firewalld or direct iptables/nftables is preferred.</p>

              <h2 class="text-xl font-semibold mb-3">Real-World Use Cases</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Securing cloud servers</li>
                <li>Quick server hardening</li>
                <li>Developer test environments</li>
                <li>Personal VPS protection</li>
                <li>Startup infrastructure</li>
              </ul>
            </div>`
          ],
          syntaxPages: [
            `<div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-2">Enable and Disable UFW</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ufw enable
ufw disable</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Set Default Policies</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ufw default deny incoming
ufw default allow outgoing</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Allow Services</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ufw allow ssh
ufw allow http
ufw allow https</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Allow Custom Ports</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ufw allow 8080/tcp</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Deny a Port</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ufw deny 21</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Limit SSH (Anti-Brute Force)</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ufw limit ssh</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Enable Logging</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ufw logging on</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Check Status</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ufw status verbose</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Delete a Rule</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ufw delete allow 8080</code></pre>
              </div>
            </div>`
          ]
        },
        {
          id: 'pfsense-intro',
          title: 'Topic 5: Introduction to pfSense (Firewall & Security Appliance Overview)',
          theoryPages: [
            `<div>
              <h2 class="text-xl font-semibold mb-3">What is pfSense?</h2>
              <p class="mb-3">pfSense is an open-source, enterprise-grade firewall and routing platform built on FreeBSD. Unlike tools such as iptables, firewalld, or UFW—which are software components installed on a general-purpose Linux OS—pfSense is a dedicated firewall operating system designed specifically for network security, routing, and traffic control.</p>
              
              <h3 class="text-lg font-semibold mb-2">pfSense is commonly deployed as:</h3>
              <ul class="list-disc ml-6 mb-3">
                <li>A perimeter firewall</li>
                <li>A network gateway</li>
                <li>A VPN concentrator</li>
                <li>A security appliance</li>
              </ul>

              <h3 class="text-lg font-semibold mb-2">It can run on:</h3>
              <ul class="list-disc ml-6 mb-3">
                <li>Dedicated hardware appliances</li>
                <li>Virtual machines (VMware, VirtualBox, Proxmox)</li>
                <li>Cloud environments</li>
                <li>Bare-metal servers</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Why pfSense is Important in Network Security</h2>
              <p class="mb-3">In real-world enterprise environments, organizations prefer appliance-based firewalls instead of manually configured Linux servers because:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>They reduce human error</li>
                <li>They centralize security controls</li>
                <li>They provide visual monitoring and reporting</li>
                <li>They support high availability and redundancy</li>
              </ul>
              <p class="mb-3">pfSense fills this role without expensive licensing, making it extremely popular among Startups, ISPs, Educational institutions, SMEs, and even large enterprises for branch offices.</p>

              <h2 class="text-xl font-semibold mb-3">Firewall Engine Used by pfSense</h2>
              <p class="mb-3">pfSense uses <strong>PF (Packet Filter)</strong>, a powerful firewall originally developed for OpenBSD.</p>
              <p class="mb-2">Key characteristics of PF:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Stateful packet inspection</li>
                <li>Very high performance</li>
                <li>Clean rule syntax (internally)</li>
                <li>Strong NAT and traffic shaping capabilities</li>
              </ul>
              <p class="mb-3">pfSense provides a web-based GUI on top of PF, allowing administrators to configure advanced firewall rules without touching the CLI.</p>

              <h2 class="text-xl font-semibold mb-3">pfSense Architecture Overview</h2>
              <p class="mb-3">A typical pfSense deployment consists of:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>WAN interface (Internet-facing)</li>
                <li>LAN interface (Internal network)</li>
                <li>Optional interfaces (DMZ, OPT1, OPT2)</li>
              </ul>
              
              <h3 class="text-lg font-semibold mb-2">Traffic flow:</h3>
              <div class="bg-black/60 text-white rounded-md p-3 mb-3 font-mono text-sm">
                Internet (WAN) <br/>
                   ↓ <br/>
                pfSense Firewall <br/>
                   ↓ <br/>
                Internal LAN / DMZ / VPN Users
              </div>
              <p class="mb-3">All traffic entering or leaving the network passes through pfSense, making it a single control point for security enforcement.</p>

              <h2 class="text-xl font-semibold mb-3">Stateful Firewall Concept in pfSense</h2>
              <p class="mb-3">pfSense operates as a stateful firewall, meaning:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>It tracks every connection</li>
                <li>It understands session states</li>
                <li>Return traffic is automatically allowed</li>
              </ul>
              <p class="mb-3">For example: If an internal user initiates a web request, pfSense records the session, and the response is allowed back automatically. No explicit inbound rule is required. This greatly improves security while reducing rule complexity.</p>
            </div>`,
            
            `<div>
              <h2 class="text-xl font-semibold mb-3">Rule Processing Logic in pfSense</h2>
              <p class="mb-3">Firewall rules in pfSense are:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Evaluated top to bottom</li>
                <li>Interface-specific</li>
                <li>First-match-wins</li>
              </ul>
              <p class="mb-3">Rules are typically applied on WAN (incoming traffic), LAN (outgoing/internal traffic), and VPN interfaces.</p>
              <p class="mb-3"><strong>By default:</strong> WAN traffic is blocked, LAN traffic is allowed. This default configuration follows best security practices.</p>

              <h2 class="text-xl font-semibold mb-3">NAT Capabilities in pfSense</h2>
              <p class="mb-3">pfSense provides advanced NAT features such as:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Automatic outbound NAT</li>
                <li>Manual outbound NAT</li>
                <li>Port forwarding (DNAT)</li>
                <li>1:1 NAT</li>
                <li>Reflection NAT</li>
              </ul>
              <p class="mb-3">These features allow internal servers to be published securely, private networks to access the internet, and complex multi-WAN setups.</p>

              <h2 class="text-xl font-semibold mb-3">VPN Support in pfSense</h2>
              <p class="mb-3">pfSense is widely used as a VPN gateway. Supported VPN technologies include:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>OpenVPN</li>
                <li>IPsec</li>
                <li>WireGuard (newer versions)</li>
              </ul>
              <p class="mb-3">Use cases: Remote employee access, Site-to-site VPN, Secure branch connectivity, Cloud-to-on-prem integration.</p>

              <h2 class="text-xl font-semibold mb-3">IDS / IPS Capabilities</h2>
              <p class="mb-3">pfSense can be extended with security packages such as Snort and Suricata. These provide Intrusion Detection (IDS) and Intrusion Prevention (IPS), signature-based attack detection, and real-time threat blocking, transforming pfSense from a firewall into a full security platform.</p>

              <h2 class="text-xl font-semibold mb-3">Traffic Shaping & QoS</h2>
              <p class="mb-3">pfSense supports advanced traffic shaping to prioritize critical applications, limit bandwidth usage, prevent network congestion, and control VoIP/video traffic. This is essential in corporate networks and ISP environments.</p>

              <h2 class="text-xl font-semibold mb-3">High Availability & Redundancy</h2>
              <p class="mb-3">pfSense supports CARP (Common Address Redundancy Protocol), Firewall failover, and State synchronization. This allows zero downtime firewall setups and enterprise-grade availability.</p>

              <h2 class="text-xl font-semibold mb-3">pfSense vs Linux Firewall (Conceptual Comparison)</h2>
              <div class="overflow-x-auto mb-3">
                <table class="min-w-full text-sm text-left">
                  <thead class="bg-white/10">
                    <tr>
                      <th class="p-2">Feature</th>
                      <th class="p-2">pfSense</th>
                      <th class="p-2">Linux Firewall</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b border-white/10"><td class="p-2">Type</td><td class="p-2">Dedicated OS</td><td class="p-2">General-purpose OS</td></tr>
                    <tr class="border-b border-white/10"><td class="p-2">Interface</td><td class="p-2">Web GUI</td><td class="p-2">CLI</td></tr>
                    <tr class="border-b border-white/10"><td class="p-2">Learning curve</td><td class="p-2">Low–Medium</td><td class="p-2">High</td></tr>
                    <tr class="border-b border-white/10"><td class="p-2">Enterprise readiness</td><td class="p-2">Very high</td><td class="p-2">Medium–High</td></tr>
                    <tr class="border-b border-white/10"><td class="p-2">HA support</td><td class="p-2">Built-in</td><td class="p-2">Manual</td></tr>
                    <tr><td class="p-2">Best use</td><td class="p-2">Gateways & firewalls</td><td class="p-2">Custom solutions</td></tr>
                  </tbody>
                </table>
              </div>

              <h2 class="text-xl font-semibold mb-3">When to Use pfSense</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>You need a centralized firewall</li>
                <li>Multiple admins manage security</li>
                <li>Visual monitoring is required</li>
                <li>High availability is needed</li>
                <li>You want enterprise features without licensing cost</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">When NOT to Use pfSense</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>You need deep OS-level customization</li>
                <li>You are building custom security scripts</li>
                <li>You require tight integration with Linux-only tools</li>
                <li>Lightweight containerized networking is preferred</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Real-World Deployment Scenarios</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Office perimeter firewall</li>
                <li>ISP customer gateways</li>
                <li>Data center edge firewall</li>
                <li>School & campus networks</li>
                <li>Secure remote access infrastructure</li>
              </ul>
            </div>`
          ],
          syntaxPages: [
            `<div class="space-y-6">
              <p class="mb-3">Since pfSense is GUI-based, configuration is done via browser.</p>
              
              <div>
                <h3 class="text-lg font-semibold mb-2">Web Interface Access</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>https://&lt;pfsense-ip-address&gt;</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Default Login</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>Username: admin
Password: pfsense</code></pre>
                <p class="text-sm text-gray-400 mt-2">(Password must be changed immediately after first login)</p>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Common Configuration Areas</h3>
                <ul class="list-disc ml-6 space-y-2">
                  <li><strong>Firewall → Rules</strong></li>
                  <li><strong>Firewall → NAT</strong></li>
                  <li><strong>VPN → OpenVPN / IPsec</strong></li>
                  <li><strong>Status → System Logs</strong></li>
                  <li><strong>Diagnostics → Packet Capture</strong></li>
                </ul>
              </div>
            </div>`
          ]
        },
        {
          id: 'port-forwarding',
          title: 'Topic 6: Configuring Port Forwarding, Blocking & Filtering',
          theoryPages: [
            `<div>
              <h2 class="text-xl font-semibold mb-3">Understanding Ports in Network Security</h2>
              <p class="mb-3">A port is a logical communication endpoint used by transport-layer protocols such as TCP and UDP. While an IP address identifies a machine, a port identifies which service or application should receive the traffic.</p>
              
              <h3 class="text-lg font-semibold mb-2">Common ports:</h3>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>22</strong> → SSH</li>
                <li><strong>80</strong> → HTTP</li>
                <li><strong>443</strong> → HTTPS</li>
                <li><strong>3306</strong> → MySQL</li>
              </ul>
              <p class="mb-3">Exposing ports without control significantly increases the attack surface of a system.</p>

              <h2 class="text-xl font-semibold mb-3">What is Port Forwarding?</h2>
              <p class="mb-3">Port forwarding allows traffic coming to a public IP and port to be redirected to a private IP and port inside the network.</p>
              
              <h3 class="text-lg font-semibold mb-2">This technique is primarily used when:</h3>
              <ul class="list-disc ml-6 mb-3">
                <li>Hosting internal web servers</li>
                <li>Publishing APIs</li>
                <li>Providing SSH or RDP access</li>
                <li>Exposing application services behind NAT</li>
              </ul>
              <p class="mb-3">Port forwarding is implemented using DNAT in iptables or GUI rules in pfSense.</p>

              <h2 class="text-xl font-semibold mb-3">Security Risks of Port Forwarding</h2>
              <p class="mb-3">Improper port forwarding can lead to:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Brute-force attacks</li>
                <li>Exploitation of vulnerable services</li>
                <li>Service fingerprinting</li>
                <li>Unauthorized access</li>
              </ul>

              <h3 class="text-lg font-semibold mb-2">Best practices:</h3>
              <ul class="list-disc ml-6 mb-3">
                <li>Forward only required ports</li>
                <li>Restrict source IP addresses</li>
                <li>Use non-standard external ports</li>
                <li>Enable logging</li>
                <li>Protect services with authentication</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Port Blocking – Reducing Attack Surface</h2>
              <p class="mb-3">Port blocking prevents unwanted services from being accessed.</p>
              
              <h3 class="text-lg font-semibold mb-2">Ports commonly blocked:</h3>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>21</strong> (FTP – insecure)</li>
                <li><strong>23</strong> (Telnet – plaintext)</li>
                <li><strong>445</strong> (SMB – ransomware target)</li>
                <li><strong>3389</strong> (RDP – brute-force target)</li>
              </ul>
              <p class="mb-3">Blocking unused ports ensures:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Fewer entry points for attackers</li>
                <li>Lower risk of exploitation</li>
                <li>Improved compliance posture</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Traffic Filtering Concepts</h2>
              <p class="mb-3">Filtering involves inspecting packets and making decisions based on:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Source IP</li>
                <li>Destination IP</li>
                <li>Protocol</li>
                <li>Port</li>
                <li>Interface</li>
                <li>Connection state</li>
              </ul>
              
              <h3 class="text-lg font-semibold mb-2">Filtering can be:</h3>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>Stateless</strong> (simple allow/deny)</li>
                <li><strong>Stateful</strong> (connection-aware)</li>
              </ul>
              <p class="mb-3">Modern Linux firewalls use stateful filtering, improving security and performance.</p>

              <h2 class="text-xl font-semibold mb-3">Inbound vs Outbound Filtering</h2>
              <p class="mb-3"><strong>Inbound filtering</strong> controls traffic entering the system</p>
              <p class="mb-3"><strong>Outbound filtering</strong> controls traffic leaving the system</p>
              
              <h3 class="text-lg font-semibold mb-2">Outbound filtering is often ignored but is critical for:</h3>
              <ul class="list-disc ml-6 mb-3">
                <li>Preventing data exfiltration</li>
                <li>Blocking malware communication</li>
                <li>Enforcing compliance</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Logging and Auditing</h2>
              <h3 class="text-lg font-semibold mb-2">Firewall logging provides:</h3>
              <ul class="list-disc ml-6 mb-3">
                <li>Visibility into blocked attacks</li>
                <li>Troubleshooting support</li>
                <li>Compliance evidence</li>
              </ul>
              <h3 class="text-lg font-semibold mb-2">However, excessive logging can:</h3>
              <ul class="list-disc ml-6 mb-3">
                <li>Consume disk space</li>
                <li>Reduce performance</li>
              </ul>
              <p class="mb-3">Logging should be selective and strategic.</p>

              <h2 class="text-xl font-semibold mb-3">Enterprise Use Cases</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Web server publishing</li>
                <li>API gateways</li>
                <li>Secure remote access</li>
                <li>DMZ configurations</li>
                <li>Regulatory compliance (PCI-DSS, ISO)</li>
              </ul>
            </div>`
          ],
          syntaxPages: [
            `<div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-2">Port Forwarding (DNAT)</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>iptables -t nat -A PREROUTING -p tcp --dport 8080 -j DNAT --to-destination 192.168.1.10:80</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Allow Forwarded Traffic</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>iptables -A FORWARD -p tcp -d 192.168.1.10 --dport 80 -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Block a Port</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>iptables -A INPUT -p tcp --dport 23 -j DROP</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Allow Specific IP Only</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>iptables -A INPUT -p tcp --dport 22 -s 203.0.113.50 -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -j DROP</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Enable Logging</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>iptables -A INPUT -p tcp --dport 22 -j LOG --log-prefix "SSH_ATTEMPT: "</code></pre>
              </div>
            </div>`
          ]
        },
        {
          id: 'linux-router-firewall',
          title: 'Topic 7: Linux as a Router + Firewall Combo',
          theoryPages: [
            `<div>
              <h2 class="text-xl font-semibold mb-3">Why Use Linux as a Router</h2>
              <p class="mb-3">Linux is not just an operating system—it is a fully capable networking platform. With proper configuration, Linux can function as:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>A router</li>
                <li>A firewall</li>
                <li>A NAT gateway</li>
                <li>A VPN endpoint</li>
                <li>A traffic monitoring device</li>
              </ul>
              <p class="mb-3">Organizations use Linux routers because they are:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Cost-effective</li>
                <li>Highly customizable</li>
                <li>Cloud-native</li>
                <li>Scriptable and automatable</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Core Routing Concepts in Linux</h2>
              <p class="mb-3">Routing determines how packets move between networks. Linux routing is controlled by:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Kernel IP forwarding</li>
                <li>Routing tables</li>
                <li>Policy-based routing</li>
                <li>Network interfaces</li>
              </ul>
              <p class="mb-3">By default, Linux behaves as an end host, not a router. Routing must be explicitly enabled.</p>

              <h3 class="text-lg font-semibold mb-2">Enabling IP Forwarding</h3>
              <p class="mb-3">IP forwarding allows Linux to pass packets between interfaces. This is the foundation of routing functionality.</p>

              <h3 class="text-lg font-semibold mb-2">Routing Tables</h3>
              <p class="mb-3">Linux uses routing tables to determine:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Destination network</li>
                <li>Next hop (gateway)</li>
                <li>Outgoing interface</li>
              </ul>
              <p class="mb-3">Multiple routing tables can exist, enabling advanced routing policies.</p>

              <h2 class="text-xl font-semibold mb-3">Combining Routing with Firewalling</h2>
              <p class="mb-3">A secure router must route traffic efficiently, filter malicious packets, perform NAT when needed, and track connection states.</p>
              <p class="mb-3">Linux achieves this through:</p>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>iproute2</strong> (routing)</li>
                <li><strong>iptables</strong> (firewall + NAT)</li>
                <li><strong>netfilter</strong> (kernel engine)</li>
              </ul>
            </div>`,
            `<div>
              <h2 class="text-xl font-semibold mb-3">Typical Linux Router Architecture</h2>
              <div class="bg-black/50 p-4 rounded-md mb-3 font-mono text-sm">
                Internet (eth0)<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br/>
                Linux Router<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br/>
                LAN / DMZ (eth1, eth2)
              </div>
              <p class="mb-3">The router NATs outbound traffic, filters inbound connections, and forwards allowed packets.</p>

              <h2 class="text-xl font-semibold mb-3">Security Responsibilities of a Linux Router</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Block spoofed packets</li>
                <li>Prevent IP forwarding abuse</li>
                <li>Restrict inter-VLAN traffic</li>
                <li>Log suspicious behavior</li>
                <li>Enforce segmentation</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Enterprise and Cloud Use Cases</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Cloud gateway servers</li>
                <li>On-premise edge routers</li>
                <li>VPN concentrators</li>
                <li>Kubernetes node routing</li>
                <li>Multi-network bridging</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Advantages Over Hardware Routers</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>No licensing costs</li>
                <li>Easy upgrades</li>
                <li>Integration with security tools</li>
                <li>Custom automation</li>
                <li>Scales with hardware</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Challenges</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Requires deep networking knowledge</li>
                <li>Misconfiguration risks</li>
                <li>Needs proper monitoring</li>
                <li>No GUI by default</li>
              </ul>
            </div>`
          ],
          syntaxPages: [
            `<div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-2">Enable Routing</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>sysctl -w net.ipv4.ip_forward=1</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">View Routing Table</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip route show</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Add Static Route</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip route add 10.10.0.0/16 via 192.168.1.1</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Enable NAT</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE</code></pre>
              </div>
            </div>`
          ]
        }
      ],
    },
    {
      id: 'module-4',
      title: 'Module 4: VPNs, Tunneling & Secure Communications',
      topics: [
        {
          id: 'openvpn-setup',
          title: 'Topic 1: OpenVPN – Complete Setup (Server + Client)',
          theoryPages: [
            `<div>
              <h2 class="text-xl font-semibold mb-3">Why VPNs Are Critical in Modern Networks</h2>
              <p class="mb-3">In today’s digital infrastructure, users rarely work from a single, secure physical location. Employees connect from:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Home networks</li>
                <li>Public Wi-Fi</li>
                <li>Coffee shops</li>
                <li>Airports</li>
                <li>Mobile networks</li>
              </ul>
              <p class="mb-3">These networks are untrusted by default. VPNs (Virtual Private Networks) solve this problem by creating a secure, encrypted tunnel over an insecure medium (the internet).</p>
              
              <h2 class="text-xl font-semibold mb-3">What is OpenVPN?</h2>
              <p class="mb-3">OpenVPN is an open-source VPN solution that operates in user space and uses SSL/TLS encryption for secure communication. It is one of the most widely used VPN technologies in:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Enterprises</li>
                <li>Cloud environments</li>
                <li>Security labs</li>
                <li>Remote access solutions</li>
              </ul>
              <p class="mb-3">OpenVPN is known for strong encryption, high configurability, cross-platform support, and firewall/NAT friendliness.</p>

              <h2 class="text-xl font-semibold mb-3">How OpenVPN Works Conceptually</h2>
              <p class="mb-3">OpenVPN creates a virtual network interface on both the client and the server:</p>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>tun</strong> → Layer 3 (IP-based routing)</li>
                <li><strong>tap</strong> → Layer 2 (Ethernet bridging)</li>
              </ul>
              <p>Most deployments use TUN mode, which routes IP packets securely.</p>
            </div>`,
            `<div>
              <h2 class="text-xl font-semibold mb-3">Encryption & Security Architecture</h2>
              <p class="mb-3">OpenVPN relies on public key infrastructure (PKI). Security components include:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Server certificate</li>
                <li>Client certificate</li>
                <li>Certificate Authority (CA)</li>
                <li>TLS key (optional but recommended)</li>
                <li>Symmetric encryption (AES)</li>
                <li>Hashing (SHA)</li>
              </ul>
              <p class="mb-3">This architecture ensures authentication of both client and server, encryption of data in transit, and protection against man-in-the-middle attacks.</p>

              <h2 class="text-xl font-semibold mb-3">OpenVPN Connection Lifecycle</h2>
              <ol class="list-decimal ml-6 mb-3">
                <li>Client initiates connection</li>
                <li>TLS handshake occurs</li>
                <li>Certificates are verified</li>
                <li>Encryption keys are exchanged</li>
                <li>Secure tunnel is established</li>
                <li>Traffic flows through virtual interface</li>
              </ol>
              <p>Each step is logged and validated, making OpenVPN highly auditable.</p>
            </div>`,
            `<div>
              <h2 class="text-xl font-semibold mb-3">Authentication Methods & Modes</h2>
              <p class="mb-3">OpenVPN supports multiple authentication mechanisms:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Certificate-based authentication (most secure)</li>
                <li>Username/password (via PAM, LDAP)</li>
                <li>Two-factor authentication</li>
                <li>Hardware tokens</li>
              </ul>
              <p class="mb-3">Enterprise environments typically use certificates + MFA.</p>

              <h3 class="text-lg font-semibold mb-2">Routing vs Bridging</h3>
              <div class="grid grid-cols-2 gap-4 mb-3">
                <div class="border border-gray-700 p-2 rounded">
                  <strong>TUN (Routing)</strong>
                  <ul class="list-disc ml-4 text-sm">
                    <li>Routes IP packets</li>
                    <li>Most enterprise VPNs</li>
                    <li>More efficient & secure</li>
                  </ul>
                </div>
                <div class="border border-gray-700 p-2 rounded">
                  <strong>TAP (Bridging)</strong>
                  <ul class="list-disc ml-4 text-sm">
                    <li>Bridges Ethernet frames</li>
                    <li>Legacy apps, broadcasts</li>
                    <li>Less efficient</li>
                  </ul>
                </div>
              </div>

              <h2 class="text-xl font-semibold mb-3">Firewall & NAT Compatibility</h2>
              <p class="mb-3">OpenVPN uses UDP (preferred for performance) or TCP (fallback). Because it runs over a single port, it traverses NAT easily, works behind firewalls, and is difficult to block.</p>

              <h2 class="text-xl font-semibold mb-3">Security Best Practices</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Use UDP instead of TCP</li>
                <li>Enable TLS authentication</li>
                <li>Use strong encryption (AES-256)</li>
                <li>Rotate certificates regularly</li>
                <li>Restrict client access via firewall rules</li>
                <li>Enable logging and monitoring</li>
              </ul>
            </div>`
          ],
          syntaxPages: [
            `<div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-2">Install OpenVPN</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>apt update
apt install openvpn easy-rsa -y</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Create PKI Infrastructure</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>make-cadir ~/openvpn-ca
cd ~/openvpn-ca
./easyrsa init-pki
./easyrsa build-ca</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Generate Server & Client Certificates</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code># Server
./easyrsa gen-req server nopass
./easyrsa sign-req server server

# Client
./easyrsa gen-req client1 nopass
./easyrsa sign-req client client1</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Generate Keys & Parameters</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code># Diffie-Hellman
./easyrsa gen-dh

# TLS Key
openvpn --genkey --secret ta.key</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Start OpenVPN Service</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>systemctl start openvpn@server
systemctl enable openvpn@server</code></pre>
              </div>
            </div>`
          ]
        },
        {
          id: 'wireguard-config',
          title: 'Topic 2: WireGuard VPN – Configuration & Secure Deployment',
          theoryPages: [
            `<div>
              <h2 class="text-xl font-semibold mb-3">Introduction to WireGuard</h2>
              <p class="mb-3">WireGuard is a modern VPN protocol designed to be simpler, faster, and more secure than traditional VPN solutions like OpenVPN and IPsec. Unlike older VPNs that rely on large, complex codebases, WireGuard focuses on minimalism and performance.</p>
              <h3 class="text-lg font-semibold mb-2">WireGuard is:</h3>
              <ul class="list-disc ml-6 mb-3">
                <li>Implemented directly in the Linux kernel</li>
                <li>Cryptographically opinionated (secure by default)</li>
                <li>Designed for high throughput and low latency</li>
                <li>Easy to audit due to its small codebase</li>
              </ul>
              
              <h2 class="text-xl font-semibold mb-3">Why WireGuard Was Created</h2>
              <p class="mb-3">Traditional VPN technologies suffer from large configuration complexity, high CPU overhead, difficult troubleshooting, and performance bottlenecks.</p>
              <p class="mb-3">WireGuard was created to reduce attack surface, simplify configuration, improve performance, and modernize VPN cryptography.</p>

              <h2 class="text-xl font-semibold mb-3">WireGuard Security Model</h2>
              <p class="mb-3">WireGuard uses state-of-the-art cryptography:</p>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>Curve25519</strong> (key exchange)</li>
                <li><strong>ChaCha20</strong> (encryption)</li>
                <li><strong>Poly1305</strong> (authentication)</li>
                <li><strong>BLAKE2s</strong> (hashing)</li>
              </ul>
              <p class="mb-3">These algorithms are faster on modern CPUs, secure against known cryptographic attacks, and consistent across platforms. Unlike OpenVPN, WireGuard does not negotiate algorithms—this eliminates downgrade attacks.</p>

              <h3 class="text-lg font-semibold mb-2">Key-Based Authentication (No Certificates)</h3>
              <p class="mb-3">WireGuard uses public/private key pairs instead of certificates. Each peer has a private key and shares its public key with other peers. This model simplifies authentication, eliminates PKI complexity, and reduces configuration errors.</p>
            </div>`,
            `<div>
              <h2 class="text-xl font-semibold mb-3">Peer-to-Peer Architecture</h2>
              <p class="mb-3">WireGuard treats every connection as peer-to-peer. There is no concept of “client” or “server”, only peers with allowed IPs. However, practically one peer usually acts as a server (static IP) while others connect dynamically.</p>

              <h3 class="text-lg font-semibold mb-2">Allowed IPs Concept</h3>
              <p class="mb-3">“Allowed IPs” serves two purposes: routing decision and access control list. Only traffic matching Allowed IPs is encrypted and accepted from peers. This doubles as a built-in firewall mechanism.</p>

              <h2 class="text-xl font-semibold mb-3">Connection Establishment</h2>
              <p class="mb-3">WireGuard uses a stateless handshake: no persistent connection and no session renegotiation. It works well with roaming devices, making it ideal for mobile users, resistant to network changes, and fast to reconnect.</p>

              <h2 class="text-xl font-semibold mb-3">NAT Traversal & Firewall Friendliness</h2>
              <p class="mb-3">WireGuard uses UDP, sends keepalive packets, and maintains NAT mappings. This ensures stable connections behind home routers, mobile networks, and cloud NAT gateways.</p>

              <h2 class="text-xl font-semibold mb-3">Performance Advantages</h2>
              <p class="mb-3">WireGuard outperforms traditional VPNs because of its kernel-space implementation, minimal packet overhead, efficient cryptography, and lack of TLS handshake overhead.</p>

              <h2 class="text-xl font-semibold mb-3">WireGuard vs OpenVPN</h2>
              <div class="overflow-x-auto mb-3">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="border-b border-gray-600">
                      <th class="p-2">Feature</th>
                      <th class="p-2">WireGuard</th>
                      <th class="p-2">OpenVPN</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b border-gray-700">
                      <td class="p-2">Codebase</td>
                      <td class="p-2">Very small</td>
                      <td class="p-2">Large</td>
                    </tr>
                    <tr class="border-b border-gray-700">
                      <td class="p-2">Performance</td>
                      <td class="p-2">Very high</td>
                      <td class="p-2">Medium</td>
                    </tr>
                    <tr class="border-b border-gray-700">
                      <td class="p-2">Encryption</td>
                      <td class="p-2">Fixed, modern</td>
                      <td class="p-2">Configurable</td>
                    </tr>
                    <tr class="border-b border-gray-700">
                      <td class="p-2">Ease of setup</td>
                      <td class="p-2">Simple</td>
                      <td class="p-2">Complex</td>
                    </tr>
                    <tr>
                      <td class="p-2">Kernel support</td>
                      <td class="p-2">Yes</td>
                      <td class="p-2">No</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 class="text-xl font-semibold mb-3">Security Best Practices</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Protect private keys</li>
                <li>Use restrictive Allowed IPs</li>
                <li>Rotate keys periodically</li>
                <li>Enable firewall rules</li>
                <li>Monitor peer activity</li>
              </ul>
            </div>`
          ],
          syntaxPages: [
            `<div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-2">Install WireGuard</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>apt update
apt install wireguard -y</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Generate Keys</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>wg genkey | tee private.key | wg pubkey > public.key</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Server Configuration (wg0.conf)</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>[Interface]
Address = 10.10.0.1/24
PrivateKey = SERVER_PRIVATE_KEY
ListenPort = 51820

[Peer]
PublicKey = CLIENT_PUBLIC_KEY
AllowedIPs = 10.10.0.2/32</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Client Configuration</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>[Interface]
Address = 10.10.0.2/32
PrivateKey = CLIENT_PRIVATE_KEY

[Peer]
PublicKey = SERVER_PUBLIC_KEY
Endpoint = SERVER_IP:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Start WireGuard</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>wg-quick up wg0
wg</code></pre>
              </div>
            </div>`
          ]
        },
        {
          id: 'ssh-tunneling',
          title: 'Topic 3: SSH Tunneling & Port Forwarding',
          theoryPages: [
            `<div>
              <h2 class="text-xl font-semibold mb-3">What is SSH Tunneling?</h2>
              <p class="mb-3">SSH Tunneling, also known as SSH Port Forwarding, is a technique that allows you to securely transmit network traffic through an encrypted SSH connection. Instead of sending data directly over the network (which may be insecure), SSH tunneling encapsulates that data inside an encrypted SSH session.</p>
              <p class="mb-3">This method is extremely useful when:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Accessing internal services securely</li>
                <li>Bypassing firewall restrictions</li>
                <li>Protecting legacy applications that do not support encryption</li>
                <li>Performing secure remote administration</li>
              </ul>
              
              <h2 class="text-xl font-semibold mb-3">Why SSH Tunneling is Important</h2>
              <p class="mb-3">Many services such as databases, web applications, and internal tools:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Transmit data in plain text</li>
                <li>Are not exposed directly to the internet</li>
                <li>Require secure access over untrusted networks</li>
              </ul>
              <p class="mb-3">SSH tunneling provides:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Confidentiality (encryption)</li>
                <li>Integrity (tamper protection)</li>
                <li>Authentication (key or password-based)</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Types of SSH Port Forwarding</h2>
              <p class="mb-3">SSH tunneling is classified into three main types, each serving different security and networking purposes.</p>

              <h3 class="text-lg font-semibold mb-2">1️⃣ Local Port Forwarding</h3>
              <p class="mb-2">Forwards traffic from the local machine to a remote server.</p>
              <p class="mb-2"><strong>Use case:</strong> Accessing a remote database via local port, Securing internal services behind firewalls.</p>
              <p class="mb-2"><strong>Traffic flow:</strong> Local Machine → SSH Tunnel → Remote Service</p>

              <h3 class="text-lg font-semibold mt-4 mb-2">2️⃣ Remote Port Forwarding</h3>
              <p class="mb-2">Allows a remote server to access a service running on the local machine.</p>
              <p class="mb-2"><strong>Use case:</strong> Exposing local development servers, Reverse shell access, Remote debugging.</p>
              <p class="mb-2"><strong>Traffic flow:</strong> Remote Server → SSH Tunnel → Local Service</p>

              <h3 class="text-lg font-semibold mt-4 mb-2">3️⃣ Dynamic Port Forwarding</h3>
              <p class="mb-2">Creates a SOCKS proxy, allowing applications to dynamically route traffic through the SSH tunnel.</p>
              <p class="mb-2"><strong>Use case:</strong> Secure web browsing, Bypassing geo-restrictions, Network traffic anonymization.</p>
            </div>`,
            `<div>
              <h2 class="text-xl font-semibold mb-3">How SSH Tunneling Works Internally</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>SSH establishes a secure TCP connection</li>
                <li>Encryption keys are exchanged</li>
                <li>SSH listens on a specified port</li>
                <li>Traffic is encrypted and forwarded</li>
                <li>Destination service receives decrypted data</li>
              </ul>
              <p class="mb-3">This entire process happens transparently to applications.</p>

              <h2 class="text-xl font-semibold mb-3">Encryption & Authentication</h2>
              <p class="mb-3">SSH uses:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Symmetric encryption (AES, ChaCha20)</li>
                <li>Public key authentication</li>
                <li>MACs for integrity</li>
              </ul>
              <p class="mb-3">This ensures that data cannot be read, altered, and unauthorized users are blocked.</p>

              <h2 class="text-xl font-semibold mb-3">Firewall & NAT Traversal</h2>
              <p class="mb-3">SSH tunneling is firewall-friendly because:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Uses TCP port 22 (usually allowed)</li>
                <li>Can operate over alternate ports</li>
                <li>Bypasses deep packet inspection</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Security Advantages</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>No additional VPN software required</li>
                <li>Minimal configuration</li>
                <li>Strong encryption</li>
                <li>Works over restricted networks</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Limitations of SSH Tunneling</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Not designed for high bandwidth</li>
                <li>Manual setup required</li>
                <li>No automatic routing like VPNs</li>
                <li>Best for targeted use cases</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Real-World Enterprise Use Cases</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Secure MySQL/PostgreSQL access</li>
                <li>Internal admin dashboards</li>
                <li>Secure Git repository access</li>
                <li>Emergency secure access paths</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">SSH Tunneling vs VPN</h2>
              <div class="overflow-x-auto mb-3">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="border-b border-gray-600">
                      <th class="p-2">Feature</th>
                      <th class="p-2">SSH Tunneling</th>
                      <th class="p-2">VPN</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b border-gray-700">
                      <td class="p-2">Scope</td>
                      <td class="p-2">Application-level</td>
                      <td class="p-2">Network-level</td>
                    </tr>
                    <tr class="border-b border-gray-700">
                      <td class="p-2">Setup</td>
                      <td class="p-2">Simple</td>
                      <td class="p-2">Moderate</td>
                    </tr>
                    <tr class="border-b border-gray-700">
                      <td class="p-2">Performance</td>
                      <td class="p-2">Medium</td>
                      <td class="p-2">High</td>
                    </tr>
                    <tr class="border-b border-gray-700">
                      <td class="p-2">Routing</td>
                      <td class="p-2">Manual</td>
                      <td class="p-2">Automatic</td>
                    </tr>
                    <tr>
                      <td class="p-2">Best for</td>
                      <td class="p-2">Quick secure access</td>
                      <td class="p-2">Full network access</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>`
          ],
          syntaxPages: [
            `<div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-2">Local Port Forwarding</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ssh -L 8080:localhost:80 user@remote_server</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Remote Port Forwarding</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ssh -R 9090:localhost:3000 user@remote_server</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Dynamic Port Forwarding (SOCKS Proxy)</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ssh -D 1080 user@remote_server</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Background SSH Tunnel</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ssh -fN -L 3306:localhost:3306 user@remote_server</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Key-Based Authentication</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ssh-keygen
ssh-copy-id user@remote_server</code></pre>
              </div>
            </div>`,
            `<div class="space-y-6">
              <h2 class="text-xl font-semibold mb-3">Hands-On Practice: Secure Remote Web Access</h2>
              <p class="mb-3"><strong>Lab Objective:</strong> Securely access a remote web service using SSH tunneling.</p>
              
              <div>
                <h3 class="text-lg font-semibold mb-2">Step 1: Create SSH Tunnel</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ssh -L 8080:localhost:80 user@server</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Step 2: Access Service</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>curl http://localhost:8080</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Step 3: Run Tunnel in Background</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ssh -fN -L 8080:localhost:80 user@server</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Step 4: Verify Tunnel</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>netstat -tulnp | grep 8080</code></pre>
              </div>
            </div>`
          ]
        },
        {
          id: 'socks-proxy',
          title: 'Topic 4: SOCKS Proxy with SSH (Dynamic Port Forwarding – Advanced)',
          theoryPages: [
            `<div>
              <h2 class="text-xl font-semibold mb-3">What is a SOCKS Proxy?</h2>
              <p class="mb-3">A SOCKS proxy is a network proxy protocol that routes traffic between a client and a server through an intermediary proxy server. Unlike HTTP proxies, SOCKS works at a lower level, allowing it to handle any type of traffic, including:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Web traffic (HTTP/HTTPS)</li>
                <li>Email protocols</li>
                <li>File transfers</li>
                <li>Custom applications</li>
              </ul>
              <p class="mb-3">SOCKS does not interpret traffic; it simply forwards it.</p>

              <h2 class="text-xl font-semibold mb-3">Why Use SOCKS over SSH?</h2>
              <p class="mb-3">When SOCKS is combined with SSH Dynamic Port Forwarding, it creates a secure encrypted tunnel that:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Encrypts all application traffic</li>
                <li>Hides destination addresses</li>
                <li>Bypasses network censorship and restrictions</li>
                <li>Requires no additional VPN software</li>
              </ul>
              <p class="mb-3">This approach is commonly used when:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>VPN installation is blocked</li>
                <li>Temporary secure access is needed</li>
                <li>You want per-application tunneling</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">SSH Dynamic Port Forwarding Explained</h2>
              <p class="mb-3">SSH dynamic port forwarding turns your local machine into a SOCKS proxy client, while the remote SSH server acts as the proxy gateway.</p>
              <p class="mb-2"><strong>Traffic flow:</strong></p>
              <p class="bg-black/50 p-3 rounded font-mono text-sm">Application → Local SOCKS Port → SSH Tunnel → Remote Server → Internet</p>
            </div>`,
            `<div>
              <h2 class="text-xl font-semibold mb-3">SOCKS4 vs SOCKS5</h2>
              <div class="overflow-x-auto mb-3">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="border-b border-gray-600">
                      <th class="p-2">Feature</th>
                      <th class="p-2">SOCKS4</th>
                      <th class="p-2">SOCKS5</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b border-gray-700"><td class="p-2">Authentication</td><td class="p-2">No</td><td class="p-2">Yes</td></tr>
                    <tr class="border-b border-gray-700"><td class="p-2">IPv6 Support</td><td class="p-2">No</td><td class="p-2">Yes</td></tr>
                    <tr class="border-b border-gray-700"><td class="p-2">UDP Support</td><td class="p-2">No</td><td class="p-2">Yes</td></tr>
                    <tr class="border-b border-gray-700"><td class="p-2">DNS Forwarding</td><td class="p-2">No</td><td class="p-2">Yes</td></tr>
                  </tbody>
                </table>
              </div>
              <p class="mb-3">SSH uses SOCKS5, making it more secure and flexible.</p>

              <h2 class="text-xl font-semibold mb-3">DNS Leak Prevention</h2>
              <p class="mb-3">One major risk when using SOCKS proxies is DNS leakage, where DNS requests are sent outside the tunnel. SSH SOCKS proxy prevents DNS leaks when:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Applications support SOCKS5</li>
                <li>Remote DNS resolution is enabled</li>
              </ul>
              <p class="mb-3">This ensures full privacy.</p>

              <h2 class="text-xl font-semibold mb-3">Use Cases in Enterprise Environments</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Secure browsing over public Wi-Fi</li>
                <li>Accessing region-restricted resources</li>
                <li>Secure testing environments</li>
                <li>Red-team and blue-team security operations</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Security Advantages</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Strong SSH encryption</li>
                <li>No plaintext traffic</li>
                <li>Firewall-friendly (port 22)</li>
                <li>Application-level control</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Limitations</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Manual configuration required</li>
                <li>Not system-wide unless configured</li>
                <li>Performance depends on SSH server</li>
                <li>Not ideal for heavy traffic</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">SOCKS Proxy vs VPN</h2>
              <div class="overflow-x-auto mb-3">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="border-b border-gray-600">
                      <th class="p-2">Feature</th>
                      <th class="p-2">SOCKS Proxy</th>
                      <th class="p-2">VPN</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b border-gray-700"><td class="p-2">Scope</td><td class="p-2">Application-level</td><td class="p-2">System-wide</td></tr>
                    <tr class="border-b border-gray-700"><td class="p-2">Encryption</td><td class="p-2">Yes (via SSH)</td><td class="p-2">Yes</td></tr>
                    <tr class="border-b border-gray-700"><td class="p-2">Routing</td><td class="p-2">Selective</td><td class="p-2">Full</td></tr>
                    <tr class="border-b border-gray-700"><td class="p-2">Setup</td><td class="p-2">Simple</td><td class="p-2">Moderate</td></tr>
                    <tr><td class="p-2">Performance</td><td class="p-2">Medium</td><td class="p-2">High</td></tr>
                  </tbody>
                </table>
              </div>

              <h2 class="text-xl font-semibold mb-3">Best Practices</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Use key-based SSH authentication</li>
                <li>Choose trusted SSH servers</li>
                <li>Monitor active tunnels</li>
                <li>Disable unused forwarding</li>
              </ul>
            </div>`
          ],
          syntaxPages: [
            `<div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-2">Create SOCKS Proxy Using SSH</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ssh -D 1080 user@remote_server</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Run SOCKS Proxy in Background</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ssh -fN -D 1080 user@remote_server</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Specify SOCKS Version</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ssh -D 1080 -o PreferredAuthentications=publickey user@remote_server</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Browser Proxy Configuration</h3>
                <div class="bg-black/50 p-3 rounded font-mono text-sm">
                  <p>SOCKS Host: 127.0.0.1</p>
                  <p>Port: 1080</p>
                  <p>SOCKS Version: 5</p>
                </div>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Check Active Tunnel</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>netstat -tulnp | grep 1080</code></pre>
              </div>
            </div>`,
            `<div class="space-y-6">
              <h2 class="text-xl font-semibold mb-3">Hands-On Lab: SOCKS Proxy Setup</h2>
              <p class="mb-3"><strong>Lab Objective:</strong> Create a secure SOCKS proxy using SSH and route browser traffic.</p>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 1: Start SOCKS Tunnel</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ssh -fN -D 1080 user@server</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Step 2: Configure Browser</h3>
                <ul class="list-disc ml-6 mb-2">
                  <li>Set SOCKS5 proxy to <code>127.0.0.1:1080</code></li>
                  <li>Enable remote DNS resolution</li>
                </ul>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Step 3: Verify IP Change</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>curl ifconfig.me</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Step 4: Monitor SSH Tunnel</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ps aux | grep ssh</code></pre>
              </div>
            </div>`
          ]
        },
        {
          id: 'gre-tunnels',
          title: 'Topic 5: GRE Tunnels (Generic Routing Encapsulation)',
          theoryPages: [
            `<div>
              <h2 class="text-xl font-semibold mb-3">What is GRE?</h2>
              <p class="mb-3">GRE (Generic Routing Encapsulation) is a tunneling protocol developed to encapsulate a wide variety of network layer protocols inside virtual point-to-point links. GRE does not provide encryption by itself; instead, it focuses on encapsulation and routing flexibility.</p>
              <p class="mb-3">GRE allows you to:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Transport non-IP protocols</li>
                <li>Carry multicast and broadcast traffic</li>
                <li>Create logical point-to-point links over IP networks</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Why GRE is Still Used</h2>
              <p class="mb-3">Despite being an older protocol, GRE remains widely used because:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>It is simple and lightweight</li>
                <li>Supported by almost all networking devices</li>
                <li>Works well with dynamic routing protocols</li>
                <li>Easy to deploy and troubleshoot</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">GRE Packet Structure</h2>
              <p class="mb-3">A GRE packet consists of:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Outer IP header</li>
                <li>GRE header</li>
                <li>Inner encapsulated packet</li>
              </ul>
              <p class="mb-3">This structure allows GRE to tunnel IPv4 over IPv4, IPv6 over IPv4, and multicast traffic.</p>

              <h2 class="text-xl font-semibold mb-3">GRE vs VPNs</h2>
              <p class="mb-3">GRE is not a VPN because:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>No encryption</li>
                <li>No authentication</li>
                <li>No confidentiality</li>
              </ul>
              <p class="mb-3">However, GRE is often combined with IPsec to form a secure tunnel.</p>
            </div>`,
            `<div>
              <h2 class="text-xl font-semibold mb-3">GRE and Routing Protocols</h2>
              <p class="mb-3">GRE supports OSPF, EIGRP, RIP, and BGP. This makes it ideal for site-to-site connectivity where routing updates are required.</p>

              <h2 class="text-xl font-semibold mb-3">GRE in Linux</h2>
              <p class="mb-3">Linux supports GRE natively through <code>ip tunnel</code> and <code>ip link</code>. Linux GRE tunnels behave like normal interfaces.</p>

              <h2 class="text-xl font-semibold mb-3">Use Cases</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Connecting branch offices</li>
                <li>Carrying multicast streams</li>
                <li>Lab environments</li>
                <li>Overlay networks</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Advantages & Limitations</h2>
              <div class="grid grid-cols-2 gap-4 mb-3">
                <div>
                    <h4 class="font-semibold">Advantages</h4>
                    <ul class="list-disc ml-4 text-sm">
                        <li>Simple to configure</li>
                        <li>Low overhead</li>
                        <li>Highly compatible</li>
                        <li>Supports dynamic routing</li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold">Limitations</h4>
                    <ul class="list-disc ml-4 text-sm">
                        <li>No encryption</li>
                        <li>Susceptible to spoofing</li>
                        <li>Requires additional security layers</li>
                        <li>Increased MTU overhead</li>
                    </ul>
                </div>
              </div>

              <h2 class="text-xl font-semibold mb-3">GRE + IPsec Architecture</h2>
              <p class="mb-3">Common enterprise architecture:</p>
              <p class="bg-black/50 p-3 rounded font-mono text-sm">Site A → GRE Tunnel → IPsec Encryption → Internet → IPsec Decryption → GRE Decapsulation → Site B</p>

              <h2 class="text-xl font-semibold mb-3">Security Considerations</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>GRE should never be exposed directly</li>
                <li>Always combine with IPsec</li>
                <li>Apply firewall rules</li>
                <li>Monitor tunnel state</li>
              </ul>
            </div>`
          ],
          syntaxPages: [
            `<div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-2">Create GRE Tunnel</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip tunnel add gre1 mode gre local 192.168.1.1 remote 192.168.2.1 ttl 255</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Assign IP Address</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip addr add 10.10.10.1/30 dev gre1</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Bring Interface Up</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip link set gre1 up</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Verify Tunnel</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip tunnel show
ip addr show gre1</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Delete GRE Tunnel</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip tunnel del gre1</code></pre>
              </div>
            </div>`,
            `<div class="space-y-6">
              <h2 class="text-xl font-semibold mb-3">Hands-On Lab: Create GRE Tunnel</h2>
              <p class="mb-3"><strong>Lab Objective:</strong> Create a GRE tunnel between two Linux systems.</p>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 1: Enable IP Forwarding</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>sysctl -w net.ipv4.ip_forward=1</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Step 2: Create Tunnel on Both Sides</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip tunnel add gre1 mode gre local &lt;LOCAL_IP&gt; remote &lt;REMOTE_IP&gt; ttl 255</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Step 3: Assign IPs</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip addr add 10.10.10.1/30 dev gre1</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Step 4: Bring Tunnel Up</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip link set gre1 up</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Step 5: Test Connectivity</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ping 10.10.10.2</code></pre>
              </div>
            </div>`
          ]
        },
        {
          id: 'ipsec-fundamentals',
          title: 'Topic 6: IPsec Fundamentals',
          theoryPages: [
            `<div>
              <h2 class="text-xl font-semibold mb-3">What is IPsec?</h2>
              <p class="mb-3">IPsec (Internet Protocol Security) is a suite of protocols designed to secure IP communications by authenticating and encrypting each IP packet in a communication session. Unlike SSH tunnels or application-level encryption, IPsec works at the network layer (Layer 3), making it transparent to applications.</p>
              <p class="mb-3">This means any application—web, database, email, or custom software—can benefit from IPsec security without modification.</p>

              <h2 class="text-xl font-semibold mb-3">Why IPsec is Critical in Enterprise Networks</h2>
              <p class="mb-3">Enterprises rely on IPsec because it provides:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Strong encryption</li>
                <li>Network-level security</li>
                <li>Standards-based interoperability</li>
                <li>Scalability across large infrastructures</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Core Security Goals of IPsec</h2>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>Confidentiality</strong> – Encrypts data to prevent eavesdropping</li>
                <li><strong>Integrity</strong> – Ensures data is not altered in transit</li>
                <li><strong>Authentication</strong> – Verifies the identity of peers</li>
                <li><strong>Anti-Replay Protection</strong> – Prevents packet replay attacks</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Main IPsec Protocols</h2>
              <div class="space-y-3 mb-3">
                <div>
                  <p class="font-semibold">1️⃣ AH (Authentication Header)</p>
                  <ul class="list-disc ml-6 text-sm">
                    <li>Provides integrity and authentication</li>
                    <li>Does not encrypt payload</li>
                    <li>Rarely used today due to lack of confidentiality</li>
                  </ul>
                </div>
                <div>
                  <p class="font-semibold">2️⃣ ESP (Encapsulating Security Payload)</p>
                  <ul class="list-disc ml-6 text-sm">
                    <li>Provides encryption, integrity, and authentication</li>
                    <li>Most commonly used IPsec protocol</li>
                    <li>Supports multiple encryption algorithms</li>
                  </ul>
                </div>
              </div>

              <h2 class="text-xl font-semibold mb-3">IPsec Modes of Operation</h2>
              <div class="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p class="font-semibold">Transport Mode</p>
                  <ul class="list-disc ml-4 text-sm">
                    <li>Encrypts only the payload</li>
                    <li>Original IP header remains intact</li>
                    <li>Used for host-to-host communication</li>
                  </ul>
                </div>
                <div>
                  <p class="font-semibold">Tunnel Mode</p>
                  <ul class="list-disc ml-4 text-sm">
                    <li>Encrypts entire IP packet</li>
                    <li>New outer IP header added</li>
                    <li>Used for VPNs and gateways</li>
                  </ul>
                </div>
              </div>

              <h2 class="text-xl font-semibold mb-3">Key Management with IKE</h2>
              <p class="mb-3">IPsec uses IKE (Internet Key Exchange) to securely exchange encryption keys. IKE performs peer authentication, SA negotiation, and key exchange.</p>
              
              <h3 class="text-lg font-semibold mb-2">IKE Phases Explained</h3>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>Phase 1:</strong> Establishes a secure control channel, authenticates peers, uses Diffie-Hellman key exchange.</li>
                <li><strong>Phase 2:</strong> Negotiates data encryption parameters, creates IPsec Security Associations (SAs), handles actual data protection.</li>
              </ul>
            </div>`,
            `<div>
              <h2 class="text-xl font-semibold mb-3">Security Associations (SA)</h2>
              <p class="mb-3">An SA defines encryption algorithm, authentication method, key lifetime, and tunnel endpoints. Each IPsec connection requires two SAs (one per direction).</p>

              <h2 class="text-xl font-semibold mb-3">Common Encryption Algorithms</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>AES-128 / AES-256</li>
                <li>SHA-256 / SHA-512</li>
                <li>Diffie-Hellman Groups (Modern implementations enforce strong cryptography)</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">IPsec and NAT Traversal</h2>
              <p class="mb-3">IPsec traditionally had issues with NAT because IP headers are encrypted and NAT modifies them. The solution is <strong>NAT-T (NAT Traversal)</strong>, which encapsulates IPsec in UDP (port 4500).</p>

              <h2 class="text-xl font-semibold mb-3">IPsec vs WireGuard vs OpenVPN</h2>
              <div class="overflow-x-auto mb-3">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="border-b border-gray-600">
                      <th class="p-2">Feature</th>
                      <th class="p-2">IPsec</th>
                      <th class="p-2">WireGuard</th>
                      <th class="p-2">OpenVPN</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b border-gray-700"><td class="p-2">OSI Layer</td><td class="p-2">Layer 3</td><td class="p-2">Layer 3</td><td class="p-2">Layer 4</td></tr>
                    <tr class="border-b border-gray-700"><td class="p-2">Encryption</td><td class="p-2">Strong</td><td class="p-2">Modern</td><td class="p-2">Strong</td></tr>
                    <tr class="border-b border-gray-700"><td class="p-2">Complexity</td><td class="p-2">High</td><td class="p-2">Low</td><td class="p-2">Medium</td></tr>
                    <tr class="border-b border-gray-700"><td class="p-2">Performance</td><td class="p-2">High</td><td class="p-2">Very High</td><td class="p-2">Medium</td></tr>
                    <tr><td class="p-2">Enterprise Use</td><td class="p-2">Very High</td><td class="p-2">Growing</td><td class="p-2">High</td></tr>
                  </tbody>
                </table>
              </div>

              <h2 class="text-xl font-semibold mb-3">Challenges & Best Practices</h2>
              <div class="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <h4 class="font-semibold">Challenges</h4>
                  <ul class="list-disc ml-4 text-sm">
                    <li>Complex configuration</li>
                    <li>Difficult troubleshooting</li>
                    <li>Vendor-specific implementations</li>
                    <li>Steep learning curve</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-semibold">Best Practices</h4>
                  <ul class="list-disc ml-4 text-sm">
                    <li>Use ESP with AES-GCM</li>
                    <li>Avoid AH</li>
                    <li>Enable PFS</li>
                    <li>Use strong DH groups</li>
                    <li>Monitor SA lifetimes</li>
                  </ul>
                </div>
              </div>
            </div>`
          ],
          syntaxPages: [
            `<div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-2">Check IPsec Support</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip xfrm state
ip xfrm policy</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">StrongSwan Installation</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>apt install strongswan -y</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Restart IPsec</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>systemctl restart strongswan</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">View Security Associations</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ipsec statusall</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">IKE Ports</h3>
                <ul class="list-disc ml-6">
                  <li>UDP 500 – IKE</li>
                  <li>UDP 4500 – NAT Traversal</li>
                </ul>
              </div>
            </div>`,
            `<div class="space-y-6">
              <h2 class="text-xl font-semibold mb-3">Hands-On Lab: IPsec Verification</h2>
              <p class="mb-3"><strong>Lab Objective:</strong> Understand IPsec components and verify kernel support.</p>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 1: Verify XFRM Framework</h3>
                <p class="mb-2 text-sm text-gray-400">XFRM is the IPsec implementation in the Linux kernel.</p>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip xfrm state</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Step 2: Check IPsec Service</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>systemctl status strongswan</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Step 3: Monitor IPsec Traffic</h3>
                <p class="mb-2 text-sm text-gray-400">Listen for IKE negotiation and NAT-T traffic.</p>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>tcpdump -i eth0 udp port 500 or udp port 4500</code></pre>
              </div>
            </div>`
          ]
        },
        {
          id: 'secure-remote-access',
          title: 'Topic 7: Secure Remote Access for Enterprise Networks',
          theoryPages: [
            `<div>
              <h2 class="text-xl font-semibold mb-3">What is Secure Remote Access?</h2>
              <p class="mb-3">Secure Remote Access refers to the technologies, policies, and controls that allow users to safely access internal enterprise resources from external or untrusted networks. These resources may include:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Internal servers</li>
                <li>Databases</li>
                <li>Email systems</li>
                <li>Cloud platforms</li>
                <li>Administrative tools</li>
              </ul>
              <p class="mb-3">The core challenge is enabling access without exposing the internal network to threats.</p>

              <h2 class="text-xl font-semibold mb-3">Why Secure Remote Access is Critical</h2>
              <p class="mb-3">Modern enterprises face:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Remote work culture</li>
                <li>BYOD (Bring Your Own Device)</li>
                <li>Cloud-based workloads</li>
                <li>Global workforce</li>
              </ul>
              <p class="mb-3">Without proper secure access mechanisms, organizations risk data breaches, unauthorized access, malware infiltration, and compliance violations.</p>

              <h2 class="text-xl font-semibold mb-3">Threat Landscape for Remote Access</h2>
              <p class="mb-3">Common threats include:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Credential theft</li>
                <li>Man-in-the-middle attacks</li>
                <li>Session hijacking</li>
                <li>Brute-force attacks</li>
                <li>Compromised endpoints</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Core Principles of Secure Remote Access</h2>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>Strong Authentication:</strong> Verifying user identity rigorously.</li>
                <li><strong>Encryption of Data in Transit:</strong> Protecting data as it travels over the network.</li>
                <li><strong>Least Privilege Access:</strong> Granting only the necessary permissions.</li>
                <li><strong>Continuous Monitoring:</strong> Real-time oversight of user activity.</li>
                <li><strong>Endpoint Validation:</strong> Ensuring accessing devices are secure.</li>
              </ul>
            </div>`,
            `<div>
              <h2 class="text-xl font-semibold mb-3">Remote Access Technologies Overview</h2>
              <div class="space-y-3 mb-4">
                <div>
                    <h4 class="font-semibold">1️⃣ VPN-Based Access</h4>
                    <p class="text-sm">IPsec VPNs, OpenVPN, WireGuard. Provides full network access through encrypted tunnels.</p>
                </div>
                <div>
                    <h4 class="font-semibold">2️⃣ Zero Trust Network Access (ZTNA)</h4>
                    <p class="text-sm">No implicit trust, per-application access, identity-based authorization. Becoming the modern enterprise standard.</p>
                </div>
                <div>
                    <h4 class="font-semibold">3️⃣ SSH-Based Access</h4>
                    <p class="text-sm">SSH tunneling, Jump servers (bastion hosts), secure admin access. Common in DevOps environments.</p>
                </div>
              </div>

              <h2 class="text-xl font-semibold mb-3">Remote Access VPN Models</h2>
              <div class="grid grid-cols-2 gap-4 mb-3">
                <div class="bg-white/5 p-3 rounded">
                    <h4 class="font-semibold mb-1">Full-Tunnel VPN</h4>
                    <ul class="list-disc ml-4 text-sm">
                        <li>All traffic routed through VPN</li>
                        <li>High security</li>
                        <li>Increased bandwidth usage</li>
                    </ul>
                </div>
                <div class="bg-white/5 p-3 rounded">
                    <h4 class="font-semibold mb-1">Split-Tunnel VPN</h4>
                    <ul class="list-disc ml-4 text-sm">
                        <li>Only corporate traffic encrypted</li>
                        <li>Better performance</li>
                        <li>Higher risk if misconfigured</li>
                    </ul>
                </div>
              </div>

              <h2 class="text-xl font-semibold mb-3">Authentication Mechanisms</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Username & password</li>
                <li>Certificate-based authentication</li>
                <li>Multi-Factor Authentication (MFA) - significantly reduces compromise risk</li>
                <li>Hardware tokens</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Role of Firewalls & Access Control</h2>
              <p class="mb-3">Secure access must be enforced using firewall rules, network segmentation, Access Control Lists (ACLs), and policy-based routing.</p>

              <h2 class="text-xl font-semibold mb-3">Bastion Hosts & Jump Servers</h2>
              <p class="mb-3">A bastion host is a hardened system used as the single entry point into the internal network. Advantages include centralized monitoring, reduced attack surface, and strong access control.</p>

              <h2 class="text-xl font-semibold mb-3">Secure Remote Access Architecture</h2>
              <p class="bg-black/50 p-3 rounded font-mono text-sm mb-3">Remote User → MFA → VPN Gateway → Firewall → Internal Resources</p>

              <h2 class="text-xl font-semibold mb-3">Best Practices</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Enforce MFA everywhere</li>
                <li>Use least privilege policies</li>
                <li>Segment internal networks</li>
                <li>Monitor continuously</li>
                <li>Rotate credentials and keys</li>
              </ul>
            </div>`
          ],
          syntaxPages: [
            `<div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-2">Enable MFA (Conceptual)</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>google-authenticator</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Check Active VPN Connections</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ipsec status
wg show</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Monitor SSH Sessions</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>who
w
last</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Firewall Rules for Remote Access</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>iptables -A INPUT -p tcp --dport 22 -s TRUSTED_IP -j ACCEPT</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Log Monitoring</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>journalctl -u ssh</code></pre>
              </div>
            </div>`,
            `<div class="space-y-6">
              <h2 class="text-xl font-semibold mb-3">Hands-On Lab: Secure Remote Access Scenario</h2>
              <p class="mb-3"><strong>Lab Objective:</strong> Simulate secure remote access using layered security.</p>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 1: Enable Firewall Restrictions</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ufw allow from 192.168.1.0/24 to any port 22</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Step 2: Enforce Key-Based SSH</h3>
                <p class="mb-2 text-sm text-gray-400">Edit /etc/ssh/sshd_config (simulation)</p>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>PasswordAuthentication no</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Step 3: Monitor Access</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>tail -f /var/log/auth.log</code></pre>
              </div>
            </div>`
          ]
        },
      ],
    },
    {
      id: 'module-5',
      title: 'Module 5: Network Monitoring, Logging & Performance Tools',
      topics: [
        {
          id: 'snmp-setup',
          title: 'Topic 1: SNMP Setup on Linux',
          theoryPages: [
            `<div>
              <h2 class="text-xl font-semibold mb-3">What is SNMP?</h2>
              <p class="mb-3">SNMP (Simple Network Management Protocol) is a standard network monitoring and management protocol used to collect, organize, and monitor information about devices on a network. It allows administrators to observe device health, performance, and availability without logging into each system manually.</p>
              <p class="mb-3">SNMP is widely used to monitor:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Linux and Windows servers</li>
                <li>Routers and switches</li>
                <li>Firewalls and security devices</li>
                <li>Printers and IoT devices</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Why SNMP is Critical in Network Monitoring</h2>
              <p class="mb-3">In enterprise networks, manual monitoring is impossible due to the large number of devices, continuous performance changes, and real-time fault detection needs.</p>
              <p class="mb-3">SNMP solves this by:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Automating data collection</li>
                <li>Centralizing monitoring</li>
                <li>Providing real-time metrics</li>
                <li>Enabling proactive issue detection</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">How SNMP Works (High-Level Architecture)</h2>
              <p class="mb-3">SNMP operates using a manager–agent model:</p>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>SNMP Manager:</strong> Central system that collects and analyzes data (e.g., Zabbix, Nagios).</li>
                <li><strong>SNMP Agent:</strong> Software running on monitored devices that exposes system information.</li>
                <li><strong>Managed Devices:</strong> Servers, routers, switches, etc.</li>
              </ul>
              
              <h2 class="text-xl font-semibold mb-3">SNMP Components Explained</h2>
              <div class="space-y-3 mb-4">
                <div>
                    <h4 class="font-semibold">1️⃣ OIDs (Object Identifiers)</h4>
                    <p class="text-sm">Unique identifiers representing specific system metrics (CPU, Memory, Disk, Traffic). Example: <code>1.3.6.1.2.1.1.3.0</code> → System uptime.</p>
                </div>
                <div>
                    <h4 class="font-semibold">2️⃣ MIBs (Management Information Bases)</h4>
                    <p class="text-sm">Hierarchical databases that define the meaning of OIDs, data types, and structure, making SNMP data human-readable.</p>
                </div>
                <div>
                    <h4 class="font-semibold">3️⃣ SNMP Operations</h4>
                    <ul class="list-disc ml-4 text-sm">
                        <li>GET – Retrieve data</li>
                        <li>SET – Modify configuration</li>
                        <li>GETNEXT / GETBULK – Retrieve large datasets</li>
                        <li>TRAP – Unsolicited alert from agent</li>
                        <li>INFORM – Acknowledged alert</li>
                    </ul>
                </div>
              </div>
            </div>`,
            `<div>
              <h2 class="text-xl font-semibold mb-3">SNMP Versions Explained</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div class="bg-white/5 p-3 rounded">
                    <h4 class="font-semibold mb-1">SNMPv1</h4>
                    <ul class="list-disc ml-4 text-sm">
                        <li>Oldest version</li>
                        <li>No encryption</li>
                        <li>Community string based</li>
                    </ul>
                </div>
                <div class="bg-white/5 p-3 rounded">
                    <h4 class="font-semibold mb-1">SNMPv2c</h4>
                    <ul class="list-disc ml-4 text-sm">
                        <li>Improved performance</li>
                        <li>Still no encryption</li>
                        <li>Widely used internally</li>
                    </ul>
                </div>
                <div class="bg-white/5 p-3 rounded border border-green-500/30">
                    <h4 class="font-semibold mb-1 text-green-400">SNMPv3 (Recommended)</h4>
                    <ul class="list-disc ml-4 text-sm">
                        <li>Authentication</li>
                        <li>Encryption</li>
                        <li>User-based security</li>
                    </ul>
                </div>
              </div>

              <h2 class="text-xl font-semibold mb-3">Security Risks & Best Practices</h2>
              <p class="mb-3">Misconfigured SNMP can expose system info, network topology, and performance data. Common mistakes include using default community strings and allowing access over public networks.</p>
              
              <h4 class="font-semibold mb-2">Best Practices:</h4>
              <ul class="list-disc ml-6 mb-3">
                <li>Use SNMPv3 only</li>
                <li>Restrict access by IP</li>
                <li>Use strong authentication</li>
                <li>Encrypt SNMP traffic</li>
                <li>Monitor SNMP logs</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">SNMP Use Cases</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Server health monitoring</li>
                <li>Bandwidth tracking</li>
                <li>Fault detection</li>
                <li>Capacity planning</li>
                <li>SLA monitoring</li>
              </ul>
              
              <h2 class="text-xl font-semibold mb-3">SNMP in Monitoring Tools</h2>
              <p class="mb-3">SNMP integrates seamlessly with Zabbix, Nagios, Prometheus, and SolarWinds.</p>
            </div>`
          ],
          syntaxPages: [
            `<div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-2">Install SNMP Agent</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>apt update
apt install snmp snmpd -y</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">SNMP Service Status</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>systemctl status snmpd</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Basic SNMPv2 Configuration</h3>
                <p class="mb-2 text-sm text-gray-400">Edit /etc/snmp/snmpd.conf</p>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>rocommunity public</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">SNMPv3 User Creation</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>net-snmp-create-v3-user -ro -A authpass -X privpass snmpuser</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Test SNMP Locally</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>snmpwalk -v2c -c public localhost</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Test SNMPv3</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>snmpwalk -v3 -u snmpuser -l authPriv -a SHA -A authpass -x AES -X privpass localhost</code></pre>
              </div>
            </div>`,
            `<div class="space-y-6">
              <h2 class="text-xl font-semibold mb-3">Hands-On Lab: Configure SNMP on Linux</h2>
              <p class="mb-3"><strong>Lab Objective:</strong> Configure SNMP on Linux and retrieve system metrics.</p>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 1: Install SNMP Packages</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>apt install snmp snmpd -y</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Step 2: Configure SNMP Agent</h3>
                <p class="mb-2 text-sm text-gray-400">Edit /etc/snmp/snmpd.conf to set community string or access controls.</p>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Step 3: Enable SNMPv3 User</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>net-snmp-create-v3-user snmpuser</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Step 4: Restart Service</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>systemctl restart snmpd</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Step 5: Retrieve Metrics</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>snmpwalk -v3 -u snmpuser -l authPriv localhost</code></pre>
              </div>
            </div>`
          ]
        },
        {
          id: 'nagios-monitoring',
          title: 'Topic 2: Nagios Monitoring',
          theoryPages: [
            `<div>
              <h2 class="text-xl font-semibold mb-3">What is Nagios?</h2>
              <p class="mb-3">Nagios is a powerful open-source monitoring system used to monitor the availability, performance, and health of IT infrastructure components. It enables administrators to detect problems early, respond to incidents quickly, and ensure high availability of services.</p>
              <p class="mb-3">Nagios can monitor:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Servers (Linux, Windows)</li>
                <li>Network devices (routers, switches, firewalls)</li>
                <li>Applications and services</li>
                <li>Network protocols (HTTP, SSH, FTP, SMTP)</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Why Nagios is Important in Enterprises</h2>
              <p class="mb-3">In large-scale environments, downtime can cause financial loss, SLA violations, and customer dissatisfaction. Nagios helps prevent this by providing continuous monitoring, immediate alerting, centralized visibility, and historical performance tracking.</p>

              <h2 class="text-xl font-semibold mb-3">Nagios Monitoring Architecture</h2>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>Nagios Core:</strong> Main monitoring engine</li>
                <li><strong>Plugins:</strong> Scripts that perform checks</li>
                <li><strong>Agents:</strong> Optional (NRPE, SNMP)</li>
                <li><strong>Web Interface:</strong> Dashboard and reports</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">How Nagios Works</h2>
              <p class="mb-3">Nagios schedules checks, plugins execute monitoring commands, results are returned as status codes (OK, WARNING, CRITICAL, UNKNOWN), and alerts are triggered if thresholds are crossed.</p>

              <h2 class="text-xl font-semibold mb-3">Nagios Plugins</h2>
              <p class="mb-3">Plugins are the heart of Nagios monitoring. Common checks include CPU load, Disk usage, Memory usage, Network latency, and Service availability.</p>
            </div>`,
            `<div>
              <h2 class="text-xl font-semibold mb-3">Active vs Passive Monitoring</h2>
              <div class="grid grid-cols-2 gap-4 mb-3">
                <div class="bg-white/5 p-3 rounded">
                    <h4 class="font-semibold mb-1">Active Checks</h4>
                    <ul class="list-disc ml-4 text-sm">
                        <li>Nagios initiates checks</li>
                        <li>Real-time monitoring</li>
                        <li>Common for services</li>
                    </ul>
                </div>
                <div class="bg-white/5 p-3 rounded">
                    <h4 class="font-semibold mb-1">Passive Checks</h4>
                    <ul class="list-disc ml-4 text-sm">
                        <li>External systems send results</li>
                        <li>Used with SNMP traps</li>
                        <li>Ideal for firewalls</li>
                    </ul>
                </div>
              </div>

              <h2 class="text-xl font-semibold mb-3">Nagios Agent – NRPE</h2>
              <p class="mb-3">NRPE (Nagios Remote Plugin Executor) allows Nagios to execute checks on remote hosts and monitor local resources securely using encrypted communication.</p>

              <h2 class="text-xl font-semibold mb-3">Alerting & Notifications</h2>
              <p class="mb-3">Nagios supports alerts via Email, SMS, Slack, and custom scripts. Alerts can be configured with escalation policies, time-based rules, and acknowledgements.</p>

              <h2 class="text-xl font-semibold mb-3">Nagios Use Cases</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Server uptime monitoring</li>
                <li>Service health tracking</li>
                <li>Capacity planning</li>
                <li>Compliance reporting</li>
                <li>Incident response</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Best Practices</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Use meaningful thresholds</li>
                <li>Group hosts logically</li>
                <li>Use templates</li>
                <li>Monitor only what matters</li>
                <li>Regularly test alerts</li>
              </ul>
            </div>`
          ],
          syntaxPages: [
            `<div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-2">Install Nagios Core</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>apt install nagios4 -y</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Check Nagios Service</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>systemctl status nagios</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Test Plugin Execution</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>/usr/lib/nagios/plugins/check_load</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Restart Nagios</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>systemctl restart nagios</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Nagios Configuration Files</h3>
                <ul class="list-disc ml-6">
                  <li><code>/etc/nagios/</code></li>
                  <li><code>/etc/nagios/objects/</code></li>
                </ul>
              </div>
            </div>`,
            `<div class="space-y-6">
              <h2 class="text-xl font-semibold mb-3">Hands-On Guide: Set up Nagios Monitoring</h2>
              <p class="mb-3"><strong>Guide Objective:</strong> Set up Nagios and monitor a Linux host.</p>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 1: Install Nagios</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>apt install nagios4 -y</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Step 2: Access Web Interface</h3>
                <ul class="list-disc ml-6 mb-2">
                  <li>Open browser</li>
                  <li>Navigate to Nagios dashboard (usually http://localhost/nagios4)</li>
                  <li>Login with configured credentials</li>
                </ul>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Step 3: Add a Host</h3>
                <ul class="list-disc ml-6 mb-2">
                  <li>Define host in config file (e.g., /etc/nagios/objects/localhost.cfg)</li>
                  <li>Assign host groups</li>
                  <li>Apply templates</li>
                </ul>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Step 4: Configure Service Checks</h3>
                <p class="mb-2 text-sm text-gray-400">Add checks for CPU, Disk, Ping, SSH in the configuration file.</p>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Step 5: Restart Nagios</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>systemctl restart nagios</code></pre>
              </div>
            </div>`
          ]
        },
        {
          id: 'zabbix-installation',
          title: 'Topic 3: Zabbix Installation & Alerts',
          theoryPages: [
            `<div>
              <h2 class="text-xl font-semibold mb-3">What is Zabbix?</h2>
              <p class="mb-3">Zabbix is a powerful enterprise-grade monitoring platform designed for real-time monitoring, alerting, and visualization of IT infrastructure. Unlike traditional monitoring tools, Zabbix provides an all-in-one solution that includes data collection, alerting, dashboards, and long-term storage.</p>
              <p class="mb-3">Zabbix can monitor:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Servers (Linux, Windows)</li>
                <li>Network devices</li>
                <li>Cloud services</li>
                <li>Virtual machines</li>
                <li>Applications and databases</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Why Zabbix is Widely Used in Enterprises</h2>
              <p class="mb-3">Zabbix is preferred in modern environments because:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>It scales easily from small to very large networks</li>
                <li>Provides rich dashboards and graphs</li>
                <li>Supports agent-based and agentless monitoring</li>
                <li>Offers powerful alerting and automation</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Zabbix Architecture Overview</h2>
              <p class="mb-3">Zabbix follows a client-server architecture:</p>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>Zabbix Server</strong> – Core monitoring engine</li>
                <li><strong>Zabbix Agent</strong> – Installed on monitored hosts</li>
                <li><strong>Zabbix Proxy</strong> – Optional (for distributed monitoring)</li>
                <li><strong>Database</strong> – Stores metrics and history</li>
                <li><strong>Web Frontend</strong> – Visualization and configuration UI</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">How Zabbix Works Internally</h2>
              <ol class="list-decimal ml-6 mb-3">
                <li>Zabbix agent collects system metrics</li>
                <li>Data is sent to Zabbix server</li>
                <li>Server evaluates triggers</li>
                <li>Alerts are generated if conditions match</li>
                <li>Data is stored for visualization and analysis</li>
              </ol>
            </div>`,
            `<div>
              <h2 class="text-xl font-semibold mb-3">Agent-Based vs Agentless Monitoring</h2>
              <div class="grid grid-cols-2 gap-4 mb-3">
                <div class="bg-white/5 p-3 rounded">
                    <h4 class="font-semibold mb-1">Agent-Based Monitoring</h4>
                    <ul class="list-disc ml-4 text-sm">
                        <li>More accurate metrics</li>
                        <li>Lower false positives</li>
                        <li>Used for servers and VMs</li>
                    </ul>
                </div>
                <div class="bg-white/5 p-3 rounded">
                    <h4 class="font-semibold mb-1">Agentless Monitoring</h4>
                    <ul class="list-disc ml-4 text-sm">
                        <li>Uses SNMP, ICMP, SSH</li>
                        <li>Ideal for network devices</li>
                        <li>No software installation required</li>
                    </ul>
                </div>
              </div>

              <h2 class="text-xl font-semibold mb-3">Triggers & Alerting Mechanism</h2>
              <p class="mb-2">Triggers define problem conditions, such as:</p>
              <ul class="list-disc ml-6 mb-3 text-sm">
                <li>CPU usage > 80%</li>
                <li>Disk usage > 90%</li>
                <li>Host unreachable</li>
              </ul>
              <p class="mb-3">Triggers are evaluated continuously.</p>
              
              <h4 class="font-semibold mb-2">Alert Actions</h4>
              <p class="mb-3">Zabbix actions can:</p>
              <ul class="list-disc ml-6 mb-3 text-sm">
                <li>Send email alerts</li>
                <li>Trigger scripts</li>
                <li>Restart services</li>
                <li>Integrate with Slack, Teams, or SMS</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Templates in Zabbix</h2>
              <p class="mb-3">Templates simplify monitoring by:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Reusing items and triggers</li>
                <li>Standardizing configurations</li>
                <li>Reducing administrative effort</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Zabbix Dashboards & Visualization</h2>
              <p class="mb-3">Zabbix provides:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Real-time graphs</li>
                <li>Historical trend analysis</li>
                <li>SLA reports</li>
                <li>Custom dashboards</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Security Features</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Encrypted agent communication</li>
                <li>Role-based access control</li>
                <li>Audit logging</li>
                <li>IP restrictions</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Zabbix vs Nagios</h2>
              <div class="overflow-x-auto mb-3">
                <table class="w-full text-sm text-left">
                  <thead class="bg-white/10">
                    <tr>
                      <th class="p-2">Feature</th>
                      <th class="p-2">Zabbix</th>
                      <th class="p-2">Nagios</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/10">
                    <tr><td class="p-2">Dashboards</td><td class="p-2">Advanced</td><td class="p-2">Basic</td></tr>
                    <tr><td class="p-2">Auto-discovery</td><td class="p-2">Yes</td><td class="p-2">Limited</td></tr>
                    <tr><td class="p-2">Alerting</td><td class="p-2">Powerful</td><td class="p-2">Powerful</td></tr>
                    <tr><td class="p-2">Scalability</td><td class="p-2">Very High</td><td class="p-2">High</td></tr>
                  </tbody>
                </table>
              </div>

              <h2 class="text-xl font-semibold mb-3">Best Practices</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Use templates</li>
                <li>Configure sensible triggers</li>
                <li>Separate proxies for remote sites</li>
                <li>Regularly review alert noise</li>
              </ul>
            </div>`
          ],
          syntaxPages: [
            `<div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-2">Install Zabbix Server & Agent</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>wget https://repo.zabbix.com/zabbix/6.0/ubuntu/pool/main/z/zabbix-release/zabbix-release_6.0-4+ubuntu22.04_all.deb
dpkg -i zabbix-release_6.0-4+ubuntu22.04_all.deb
apt update
apt install zabbix-server-mysql zabbix-frontend-php zabbix-apache-conf zabbix-sql-scripts zabbix-agent</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Start Zabbix Services</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>systemctl restart zabbix-server zabbix-agent apache2
systemctl enable zabbix-server zabbix-agent apache2</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Zabbix Agent Configuration</h3>
                <p class="mb-2 text-sm text-gray-400">Edit /etc/zabbix/zabbix_agentd.conf:</p>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>Server=192.168.1.10        # Zabbix Server IP
ServerActive=192.168.1.10  # For active checks
Hostname=Web-Server-01     # Must match host in Zabbix UI</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Check Agent Logs</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>tail -f /var/log/zabbix/zabbix_agentd.log</code></pre>
              </div>
            </div>`,
            `<div class="space-y-6">
              <h2 class="text-xl font-semibold mb-3">Hands-On Guide: Set up Zabbix Monitoring</h2>
              <p class="mb-3"><strong>Guide Objective:</strong> Install Zabbix Agent and connect it to the Server.</p>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 1: Install Zabbix Agent</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>apt install zabbix-agent -y</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 2: Configure Agent</h3>
                <p class="mb-2 text-sm text-gray-400">Edit <code>/etc/zabbix/zabbix_agentd.conf</code>:</p>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code># Point to your Zabbix Server
Server=192.168.1.100
ServerActive=192.168.1.100

# Set a unique hostname
Hostname=Linux-Lab-VM</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 3: Restart Agent</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>systemctl restart zabbix-agent
systemctl enable zabbix-agent</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 4: Add Host in Web UI</h3>
                <ul class="list-disc ml-6 mb-2 text-sm">
                    <li>Go to <strong>Configuration &gt; Hosts &gt; Create Host</strong></li>
                    <li><strong>Host name:</strong> Linux-Lab-VM (must match config)</li>
                    <li><strong>Templates:</strong> Linux by Zabbix agent</li>
                    <li><strong>Interfaces:</strong> Add Agent interface with IP</li>
                </ul>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 5: Verify Data</h3>
                <p class="mb-2 text-sm text-gray-400">Go to <strong>Monitoring &gt; Latest data</strong> and filter by your host.</p>
              </div>
            </div>`
          ]
        },
        {
          id: 'syslog-management',
          title: 'Topic 4: Syslog Management & Log Rotation',
          theoryPages: [
            `<div>
              <h2 class="text-xl font-semibold mb-3">What is Syslog?</h2>
              <p class="mb-3">Syslog is a standard logging protocol and framework used by operating systems, applications, and network devices to generate, store, and transmit log messages. Logs are critical for understanding system behavior, security events, failures, and performance issues.</p>
              <p class="mb-3">Syslog allows logs to be:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Centralized</li>
                <li>Categorized</li>
                <li>Stored securely</li>
                <li>Analyzed efficiently</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Why Log Management is Critical</h2>
              <p class="mb-3">Without proper log management:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Security incidents go undetected</li>
                <li>Troubleshooting becomes guesswork</li>
                <li>Compliance requirements fail</li>
                <li>Systems run out of disk space</li>
              </ul>
              <p class="mb-3"><strong>Syslog ensures visibility and accountability across infrastructure.</strong></p>

              <h2 class="text-xl font-semibold mb-3">How Syslog Works</h2>
              <p class="mb-3">Syslog operates using:</p>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>Syslog clients</strong> – Generate logs</li>
                <li><strong>Syslog server</strong> – Receives and stores logs</li>
                <li><strong>Transport protocols</strong> – UDP, TCP, TLS</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Syslog Message Structure</h2>
              <p class="mb-3">Each syslog message contains:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Facility – Source of log (kernel, auth, mail)</li>
                <li>Severity – Importance level</li>
                <li>Timestamp</li>
                <li>Hostname</li>
                <li>Message content</li>
              </ul>
            </div>`,
            `<div>
              <h2 class="text-xl font-semibold mb-3">Syslog Severity Levels</h2>
              <div class="overflow-x-auto mb-3">
                <table class="w-full text-sm text-left">
                  <thead class="bg-white/10">
                    <tr><th class="p-2">Level</th><th class="p-2">Meaning</th></tr>
                  </thead>
                  <tbody class="divide-y divide-white/10">
                    <tr><td class="p-2">0</td><td class="p-2 text-red-500 font-bold">Emergency</td></tr>
                    <tr><td class="p-2">1</td><td class="p-2 text-red-400 font-bold">Alert</td></tr>
                    <tr><td class="p-2">2</td><td class="p-2 text-red-300 font-bold">Critical</td></tr>
                    <tr><td class="p-2">3</td><td class="p-2 text-orange-400">Error</td></tr>
                    <tr><td class="p-2">4</td><td class="p-2 text-yellow-400">Warning</td></tr>
                    <tr><td class="p-2">5</td><td class="p-2 text-blue-300">Notice</td></tr>
                    <tr><td class="p-2">6</td><td class="p-2 text-green-300">Informational</td></tr>
                    <tr><td class="p-2">7</td><td class="p-2 text-gray-400">Debug</td></tr>
                  </tbody>
                </table>
              </div>

              <h2 class="text-xl font-semibold mb-3">Syslog Facilities</h2>
              <p class="mb-3">Facilities categorize logs by source:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>auth / authpriv</li>
                <li>daemon</li>
                <li>kernel</li>
                <li>cron</li>
                <li>local0–local7</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Syslog Implementations in Linux</h2>
              <p class="mb-3">Common implementations:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>rsyslog (default in most distros)</li>
                <li>syslog-ng</li>
                <li>journald (systemd)</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Centralized Logging</h2>
              <p class="mb-3">Central logging provides:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Single source of truth</li>
                <li>Easier correlation</li>
                <li>Enhanced security visibility</li>
                <li>Better incident response</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Log Rotation Explained</h2>
              <p class="mb-3">Log rotation prevents:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Disk exhaustion</li>
                <li>Performance degradation</li>
                <li>Unmanageable log files</li>
              </ul>
              <p class="mb-3">Rotation strategies:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Size-based</li>
                <li>Time-based</li>
                <li>Compression</li>
                <li>Retention policies</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">logrotate Utility</h2>
              <p class="mb-3">logrotate is used to:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Rotate logs</li>
                <li>Compress old logs</li>
                <li>Remove outdated logs</li>
                <li>Restart services safely</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Security & Compliance Importance</h2>
              <p class="mb-3">Logs are required for:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Forensic analysis</li>
                <li>Audits (ISO, SOC, PCI-DSS)</li>
                <li>Insider threat detection</li>
              </ul>
              <p class="mb-3">Logs must be:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Tamper-resistant</li>
                <li>Retained securely</li>
                <li>Time-synchronized</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Best Practices</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Centralize logs</li>
                <li>Use TLS for transport</li>
                <li>Rotate aggressively</li>
                <li>Monitor critical logs</li>
                <li>Protect log files</li>
              </ul>
            </div>`
          ],
          syntaxPages: [
            `<div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-2">Check Syslog Service</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>systemctl status rsyslog</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Syslog Configuration Files</h3>
                <div class="bg-white/5 p-3 rounded text-sm space-y-2">
                    <p><code>/etc/rsyslog.conf</code> – Main configuration file</p>
                    <p><code>/etc/rsyslog.d/</code> – Directory for custom configs</p>
                </div>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Example: Send Logs to Remote Server</h3>
                <p class="mb-2 text-sm text-gray-400">Add to /etc/rsyslog.conf:</p>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>*.* @192.168.1.50:514  # UDP
*.* @@192.168.1.50:514 # TCP</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Example: Log Specific Facility</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>cron.* /var/log/cron.log
auth,authpriv.* /var/log/auth.log</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Restart Syslog</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>systemctl restart rsyslog</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Logrotate Configuration Example</h3>
                <p class="mb-2 text-sm text-gray-400">File: /etc/logrotate.d/myapp</p>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>/var/log/myapp.log {
    daily
    rotate 7
    compress
    missingok
    notifempty
    create 0640 root root
}</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Force Log Rotation</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>logrotate -f /etc/logrotate.conf</code></pre>
              </div>
            </div>`,
            `<div class="space-y-6">
              <h2 class="text-xl font-semibold mb-3">Hands-On Guide: Centralized Logging</h2>
              <p class="mb-3"><strong>Guide Objective:</strong> Configure centralized logging and implement log rotation.</p>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 1: Verify rsyslog</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>systemctl status rsyslog</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 2: Enable Remote Logging</h3>
                <p class="mb-2 text-sm text-gray-400">Edit <code>/etc/rsyslog.conf</code> and uncomment UDP/TCP reception:</p>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code># Provides UDP syslog reception
module(load="imudp")
input(type="imudp" port="514")

# Provides TCP syslog reception
module(load="imtcp")
input(type="imtcp" port="514")</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 3: Configure Log Storage Template</h3>
                <p class="mb-2 text-sm text-gray-400">Add a template to store remote logs separately:</p>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>$template RemoteLogs,"/var/log/remotes/%HOSTNAME%/%PROGRAMNAME%.log"
*.* ?RemoteLogs</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 4: Configure Log Rotation</h3>
                <p class="mb-2 text-sm text-gray-400">Create <code>/etc/logrotate.d/remotelogs</code>:</p>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>/var/log/remotes/*/*.log {
    daily
    rotate 14
    compress
    missingok
    sharedscripts
    postrotate
        /usr/lib/rsyslog/rsyslog-rotate
    endscript
}</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 5: Restart & Test</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>systemctl restart rsyslog
logrotate -d /etc/logrotate.d/remotelogs  # Debug mode</code></pre>
              </div>
            </div>`
          ]
        },
        {
          id: 'bandwidth-monitoring',
          title: 'Topic 5: Bandwidth & Performance Monitoring Tools (iftop, htop, bmon, nload)',
          theoryPages: [
            `<div>
              <h2 class="text-xl font-semibold mb-3">Why Performance & Bandwidth Monitoring Matters</h2>
              <p class="mb-3">In modern networks, performance issues are often silent killers. Systems may appear “up” but still suffer from:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>High latency</li>
                <li>Bandwidth congestion</li>
                <li>CPU saturation</li>
                <li>Memory exhaustion</li>
              </ul>
              <p class="mb-3">Bandwidth and performance monitoring tools allow administrators to observe real-time system behavior and quickly identify bottlenecks before they cause outages.</p>

              <h2 class="text-xl font-semibold mb-3">Categories of Monitoring Tools</h2>
              <p class="mb-3">The tools covered in this topic fall into two main categories:</p>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>System resource monitoring</strong></li>
                <li><strong>Network bandwidth monitoring</strong></li>
              </ul>
              <p class="mb-3">Each tool focuses on a specific layer of system performance.</p>

              <h2 class="text-xl font-semibold mb-3">🔍 Tool 1: htop (System Resource Monitoring)</h2>
              <p class="mb-3"><strong>What is htop?</strong></p>
              <p class="mb-3">htop is an interactive, real-time system monitoring tool that provides a visual overview of system resources, including CPU, memory, swap, and running processes.</p>
              <p class="mb-3">Unlike traditional tools, htop offers:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Color-coded output</li>
                <li>Mouse support</li>
                <li>Easy process management</li>
              </ul>
              <p class="mb-3"><strong>What htop Monitors</strong></p>
              <ul class="list-disc ml-6 mb-3">
                <li>CPU utilization per core</li>
                <li>Memory and swap usage</li>
                <li>Process priority</li>
                <li>Thread-level visibility</li>
              </ul>
              <p class="mb-3"><strong>Why htop is Important</strong></p>
              <ul class="list-disc ml-6 mb-3">
                <li>Detect CPU-hogging processes</li>
                <li>Identify memory leaks</li>
                <li>Kill unresponsive services</li>
                <li>Analyze load distribution</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">🌐 Tool 2: iftop (Interface Bandwidth Monitoring)</h2>
              <p class="mb-3"><strong>What is iftop?</strong></p>
              <p class="mb-3">iftop monitors real-time bandwidth usage on network interfaces, similar to how htop monitors CPU usage.</p>
              <p class="mb-3">iftop displays:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Source and destination IPs</li>
                <li>Active connections</li>
                <li>Real-time throughput</li>
              </ul>
              <p class="mb-3"><strong>Why iftop is Critical</strong></p>
              <ul class="list-disc ml-6 mb-3">
                <li>Detect bandwidth abuse</li>
                <li>Identify top talkers</li>
                <li>Troubleshoot slow networks</li>
                <li>Investigate suspicious traffic</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">📊 Tool 3: nload (Traffic Overview Tool)</h2>
              <p class="mb-3"><strong>What is nload?</strong></p>
              <p class="mb-3">nload provides a simple, real-time visualization of incoming and outgoing network traffic.</p>
              <p class="mb-3">It focuses on:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Overall bandwidth usage</li>
                <li>Peak and average rates</li>
                <li>Interface-level monitoring</li>
              </ul>
              <p class="mb-3"><strong>Use Case</strong></p>
              <ul class="list-disc ml-6 mb-3">
                <li>Quick checks</li>
                <li>Low-overhead monitoring</li>
                <li>Server bandwidth analysis</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">📈 Tool 4: bmon (Advanced Bandwidth Monitor)</h2>
              <p class="mb-3"><strong>What is bmon?</strong></p>
              <p class="mb-3">bmon (Bandwidth Monitor) is a powerful tool that provides detailed interface statistics with customizable views.</p>
              <p class="mb-3">It supports:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Multiple interfaces</li>
                <li>Historical data</li>
                <li>Packet-level statistics</li>
              </ul>
              <p class="mb-3"><strong>Why bmon is Useful</strong></p>
              <ul class="list-disc ml-6 mb-3">
                <li>Long-term bandwidth analysis</li>
                <li>Interface comparison</li>
                <li>Detecting packet loss</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Comparison of Tools</h2>
              <div class="overflow-x-auto mb-3">
                <table class="w-full text-sm text-left">
                  <thead class="bg-white/10">
                    <tr>
                      <th class="p-2">Tool</th>
                      <th class="p-2">Focus Area</th>
                      <th class="p-2">Best Use Case</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/10">
                    <tr><td class="p-2">htop</td><td class="p-2">CPU & Memory</td><td class="p-2">Process analysis</td></tr>
                    <tr><td class="p-2">iftop</td><td class="p-2">Live traffic</td><td class="p-2">Top talkers</td></tr>
                    <tr><td class="p-2">nload</td><td class="p-2">Bandwidth</td><td class="p-2">Quick overview</td></tr>
                    <tr><td class="p-2">bmon</td><td class="p-2">Interfaces</td><td class="p-2">Detailed stats</td></tr>
                  </tbody>
                </table>
              </div>

              <h2 class="text-xl font-semibold mb-3">Performance Troubleshooting Workflow</h2>
              <ol class="list-decimal ml-6 mb-3">
                <li>Check CPU & memory (htop)</li>
                <li>Analyze traffic flows (iftop)</li>
                <li>Measure overall bandwidth (nload)</li>
                <li>Compare interfaces (bmon)</li>
              </ol>

              <h2 class="text-xl font-semibold mb-3">Best Practices</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Monitor during peak hours</li>
                <li>Correlate metrics</li>
                <li>Document baselines</li>
                <li>Combine with logging tools</li>
              </ul>
            </div>`
          ],
          syntaxPages: [
            `<div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-2">Install Monitoring Tools</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>apt install htop iftop nload bmon -y</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Run htop</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>htop</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Run iftop</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>iftop -i eth0</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Run nload</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>nload</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Run bmon</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>bmon</code></pre>
              </div>
            </div>`,
            `<div class="space-y-6">
              <h2 class="text-xl font-semibold mb-3">Hands-On Guide: Real-Time Monitoring</h2>
              <p class="mb-3"><strong>Guide Objective:</strong> Monitor system performance and network bandwidth in real time.</p>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 1: Observe System Load</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>htop</code></pre>
                <ul class="list-disc ml-6 mt-2 text-sm">
                  <li>Identify CPU spikes</li>
                  <li>Check memory usage</li>
                </ul>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 2: Monitor Network Traffic</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>iftop -i eth0</code></pre>
                <ul class="list-disc ml-6 mt-2 text-sm">
                  <li>Identify high-bandwidth connections</li>
                  <li>Detect anomalies</li>
                </ul>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 3: Check Overall Bandwidth</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>nload</code></pre>
                <ul class="list-disc ml-6 mt-2 text-sm">
                  <li>Observe RX/TX rates</li>
                  <li>Identify saturation</li>
                </ul>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 4: Deep Interface Analysis</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>bmon</code></pre>
                <ul class="list-disc ml-6 mt-2 text-sm">
                  <li>Compare interfaces</li>
                  <li>Monitor packet flow</li>
                </ul>
              </div>
            </div>`
          ]
        },
        {
          id: 'mtr-traceroute',
          title: 'Topic 6: MTR & Traceroute – Advanced Usage',
          theoryPages: [
            `<div>
              <h2 class="text-xl font-semibold mb-3">Why Path Analysis Matters</h2>
              <p class="mb-3">Network performance problems are often not caused by the source or destination, but by intermediate network hops. Packet loss, latency spikes, or routing loops can occur anywhere between two endpoints.</p>
              <p class="mb-3">Tools like traceroute and MTR help administrators:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Visualize packet paths</li>
                <li>Identify problematic hops</li>
                <li>Measure latency and packet loss</li>
                <li>Troubleshoot intermittent network issues</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Understanding Traceroute</h2>
              <p class="mb-3">traceroute is a diagnostic tool that displays the path packets take from a source to a destination.</p>
              <p class="mb-3">It works by:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Sending packets with increasing TTL (Time To Live)</li>
                <li>Each router decrements TTL by 1</li>
                <li>When TTL reaches zero, router responds with ICMP Time Exceeded</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Traceroute Packet Types</h2>
              <p class="mb-3">Traceroute can use:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>ICMP (default on Linux)</li>
                <li>UDP</li>
                <li>TCP</li>
              </ul>
              <p class="mb-3">Each method is useful depending on firewall rules and network behavior.</p>

              <h2 class="text-xl font-semibold mb-3">Limitations of Traceroute</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Provides only a snapshot</li>
                <li>No packet loss statistics</li>
                <li>May show incomplete paths due to ICMP filtering</li>
                <li>Cannot detect intermittent issues reliably</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">What is MTR?</h2>
              <p class="mb-3">MTR (My Traceroute) combines:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Traceroute functionality</li>
                <li>Continuous ping statistics</li>
              </ul>
              <p class="mb-3">MTR continuously sends packets and updates statistics in real time.</p>

              <h2 class="text-xl font-semibold mb-3">Why MTR is More Powerful</h2>
              <p class="mb-3">MTR provides:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Packet loss percentage</li>
                <li>Average latency</li>
                <li>Worst-case latency</li>
                <li>Best-case latency</li>
                <li>Real-time updates</li>
              </ul>
              <p class="mb-3">This makes MTR ideal for diagnosing intermittent and long-term issues.</p>

              <h2 class="text-xl font-semibold mb-3">Understanding MTR Output</h2>
              <p class="mb-3">Key metrics include:</p>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>Loss%</strong> – Packet loss per hop</li>
                <li><strong>Last</strong> – Last latency measurement</li>
                <li><strong>Avg</strong> – Average latency</li>
                <li><strong>Best/Wrst</strong> – Best and worst latency</li>
                <li><strong>StDev</strong> – Latency variation</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Interpreting Packet Loss Correctly</h2>
              <p class="mb-3">Packet loss at intermediate hops:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>May be normal</li>
                <li>Often due to ICMP rate limiting</li>
                <li>Only concerning if loss continues to destination</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Traceroute vs MTR</h2>
              <div class="overflow-x-auto mb-3">
                <table class="w-full text-sm text-left">
                  <thead class="bg-white/10">
                    <tr>
                      <th class="p-2">Feature</th>
                      <th class="p-2">Traceroute</th>
                      <th class="p-2">MTR</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/10">
                    <tr><td class="p-2">Real-time updates</td><td class="p-2">No</td><td class="p-2">Yes</td></tr>
                    <tr><td class="p-2">Packet loss stats</td><td class="p-2">No</td><td class="p-2">Yes</td></tr>
                    <tr><td class="p-2">Latency trends</td><td class="p-2">No</td><td class="p-2">Yes</td></tr>
                    <tr><td class="p-2">Best for</td><td class="p-2">Quick checks</td><td class="p-2">Deep analysis</td></tr>
                  </tbody>
                </table>
              </div>

              <h2 class="text-xl font-semibold mb-3">Advanced Use Cases</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>ISP troubleshooting</li>
                <li>SLA verification</li>
                <li>Cloud connectivity issues</li>
                <li>VPN tunnel performance</li>
                <li>DDoS investigation</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Firewall & NAT Considerations</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>ICMP may be blocked</li>
                <li>TCP-based tracing may be required</li>
                <li>NAT can obscure hop identity</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Best Practices</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Run tests for sufficient duration</li>
                <li>Compare multiple paths</li>
                <li>Document baseline paths</li>
                <li>Combine with SNMP and logs</li>
              </ul>
            </div>`
          ],
          syntaxPages: [
            `<div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-2">Basic Traceroute</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>traceroute google.com</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Traceroute Using TCP</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>traceroute -T -p 443 google.com</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">MTR Interactive Mode</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>mtr google.com</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">MTR Report Mode</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>mtr -r -c 100 google.com</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">MTR with TCP</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>mtr -T -P 443 google.com</code></pre>
              </div>
            </div>`,
            `<div class="space-y-6">
              <h2 class="text-xl font-semibold mb-3">Hands-On Diagnostic Guide</h2>
              <p class="mb-3"><strong>Guide Objective:</strong> Diagnose network latency and packet loss using MTR and traceroute.</p>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 1: Identify Network Path</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>traceroute example.com</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 2: Run Continuous Analysis</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>mtr example.com</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 3: Generate Report</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>mtr -r -c 50 example.com</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 4: Interpret Results</h3>
                <ul class="list-disc ml-6 mt-2 text-sm">
                  <li>Check packet loss continuity</li>
                  <li>Identify latency spikes</li>
                  <li>Compare hops</li>
                </ul>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Expected Outcome</h3>
                <ul class="list-disc ml-6 mt-2 text-sm">
                  <li>Clear understanding of packet path</li>
                  <li>Identification of problematic hops</li>
                  <li>Accurate latency analysis</li>
                  <li>Improved network troubleshooting skills</li>
                </ul>
              </div>
            </div>`
          ]
        },
        {
          id: 'network-baseline',
          title: 'Topic 7: Network Baseline Creation & Anomaly Detection',
          theoryPages: [
            `<div>
              <h2 class="text-xl font-semibold mb-3">What is a Network Baseline?</h2>
              <p class="mb-3">A network baseline is a documented snapshot of normal network behavior, including metrics such as:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Bandwidth usage</li>
                <li>Latency</li>
                <li>Packet loss</li>
                <li>CPU and memory utilization of network devices</li>
                <li>Traffic patterns and protocol distribution</li>
              </ul>
              <p class="mb-3">A baseline provides a reference point to identify deviations and potential issues.</p>

              <h2 class="text-xl font-semibold mb-3">Why Baselines are Critical</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div class="bg-white/5 p-4 rounded-lg">
                  <h3 class="font-semibold mb-2 text-red-400">Without Baselines</h3>
                  <ul class="list-disc ml-6 space-y-1">
                    <li>Troubleshooting is guesswork</li>
                    <li>Performance issues go undetected</li>
                    <li>Security breaches may remain hidden</li>
                    <li>Capacity planning is unreliable</li>
                  </ul>
                </div>
                <div class="bg-white/5 p-4 rounded-lg">
                  <h3 class="font-semibold mb-2 text-green-400">With Baselines</h3>
                  <ul class="list-disc ml-6 space-y-1">
                    <li>Deviations trigger alerts</li>
                    <li>Trends are easily analyzed</li>
                    <li>Network health is quantifiable</li>
                  </ul>
                </div>
              </div>

              <h2 class="text-xl font-semibold mb-3">Key Metrics for Baseline Creation</h2>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>Traffic Volume</strong> – Average and peak bandwidth per interface</li>
                <li><strong>Latency</strong> – Round-trip time between key devices</li>
                <li><strong>Packet Loss</strong> – Normal loss percentage for each path</li>
                <li><strong>Error Rates</strong> – Interface errors and collisions</li>
                <li><strong>Protocol Distribution</strong> – TCP, UDP, ICMP, etc.</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Tools for Baseline Creation</h2>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>SNMP</strong> – Collect continuous device statistics</li>
                <li><strong>NetFlow / sFlow</strong> – Monitor traffic patterns</li>
                <li><strong>Nagios / Zabbix</strong> – Historical trends</li>
                <li><strong>htop / iftop / nload</strong> – System and interface metrics</li>
                <li><strong>MTR / traceroute</strong> – Latency and path analysis</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Steps to Create a Network Baseline</h2>
              <ol class="list-decimal ml-6 mb-3 space-y-2">
                <li><strong>Define Critical Metrics</strong> – Choose what to measure (traffic, latency, CPU)</li>
                <li><strong>Collect Data Over Time</strong> – Minimum 1–2 weeks of normal activity</li>
                <li><strong>Analyze Data</strong> – Identify average, peak, and low patterns</li>
                <li><strong>Document Baseline</strong> – Store in centralized repository</li>
                <li><strong>Review Periodically</strong> – Adjust baseline as network grows or changes</li>
              </ol>

              <h2 class="text-xl font-semibold mb-3">Anomaly Detection</h2>
              <p class="mb-3">Anomalies are deviations from the baseline. Detection involves:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Comparing real-time metrics with baseline</li>
                <li>Using thresholds or statistical models</li>
                <li>Identifying unusual spikes, drops, or patterns</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Types of Anomalies</h2>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>Traffic Anomalies</strong> – Unexpected spikes or drops</li>
                <li><strong>Performance Anomalies</strong> – High latency, packet loss</li>
                <li><strong>Security Anomalies</strong> – DDoS, unusual protocol use</li>
                <li><strong>Configuration Anomalies</strong> – Misconfigured routers or firewalls</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Automated Anomaly Detection</h2>
              <p class="mb-3">Modern tools use:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Threshold-based alerts</li>
                <li>Statistical anomaly detection</li>
                <li>Machine learning for predictive alerts</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Benefits of Baseline + Anomaly Detection</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Early detection of issues</li>
                <li>Reduced downtime</li>
                <li>Optimized network performance</li>
                <li>Improved security posture</li>
                <li>Informed capacity planning</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Best Practices</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Use multiple monitoring tools</li>
                <li>Maintain historical data for trend analysis</li>
                <li>Correlate anomalies with system events</li>
                <li>Update baselines regularly</li>
                <li>Integrate with alerting and ticketing systems</li>
              </ul>
            </div>`
          ],
          syntaxPages: [
            `<div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-2">SNMP Data Collection</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>snmpwalk -v3 -u snmpuser -l authPriv localhost</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Network Traffic Snapshot</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>iftop -i eth0</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Latency & Packet Loss</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>mtr -r -c 100 example.com</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">System Metrics</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>htop
nload
bmon</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Log-based Anomaly Detection</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>tail -f /var/log/syslog | grep -i error</code></pre>
              </div>
            </div>`,
            `<div class="space-y-6">
              <h2 class="text-xl font-semibold mb-3">Hands-On Implementation Guide</h2>
              <p class="mb-3"><strong>Guide Objective:</strong> Create a baseline for network and system performance, detect anomalies in real time.</p>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 1: Collect Metrics Over Time</h3>
                <p class="mb-2 text-sm text-gray-400">Use SNMP, htop, iftop, nload, bmon</p>
                <ul class="list-disc ml-6 mb-2 text-sm">
                  <li>Record hourly/daily stats</li>
                </ul>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 2: Analyze Patterns</h3>
                <ul class="list-disc ml-6 mb-2 text-sm">
                  <li>Determine average CPU, memory, traffic, latency</li>
                  <li>Identify normal fluctuations</li>
                </ul>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 3: Document Baseline</h3>
                <ul class="list-disc ml-6 mb-2 text-sm">
                  <li>Store metrics in spreadsheets, Zabbix, or centralized monitoring tools</li>
                  <li>Define thresholds based on averages</li>
                </ul>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 4: Monitor Real-Time Metrics</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>iftop -i eth0
mtr example.com
htop</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 5: Detect Anomalies</h3>
                <ul class="list-disc ml-6 mb-2 text-sm">
                  <li>Compare real-time data with baseline</li>
                  <li>Investigate deviations</li>
                  <li>Generate alerts via Nagios/Zabbix</li>
                </ul>
              </div>
            </div>`
          ]
        },
      ],
    },
    {
      id: 'module-6',
      title: 'Module 6: Routing, Switching & VLANs in Linux',
      topics: [
        {
          id: 'linux-router',
          title: 'Topic 1: Linux as a Router',
          theoryPages: [
            `<div>
              <h2 class="text-xl font-semibold mb-3">What Does It Mean for Linux to Act as a Router?</h2>
              <p class="mb-3">Linux is not just an operating system—it can function as a fully capable network router, forwarding packets between multiple network interfaces. Using Linux as a router allows small to medium enterprises or labs to control traffic, implement security policies, and experiment with advanced networking.</p>
              <p class="mb-3">A Linux router enables:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Packet forwarding</li>
                <li>NAT (Network Address Translation)</li>
                <li>Routing between VLANs</li>
                <li>Firewall integration</li>
                <li>Policy-based routing</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Routing Fundamentals</h2>
              <p class="mb-3">A router operates at Layer 3 (Network Layer) of the OSI model. Its main functions are:</p>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>Packet Forwarding</strong> – Move packets from one network to another</li>
                <li><strong>Routing Decisions</strong> – Determine the best path for traffic</li>
                <li><strong>Network Segmentation</strong> – Divide networks into separate subnets for performance and security</li>
              </ul>
              <p class="mb-3">Linux uses the kernel routing table to make forwarding decisions.</p>

              <h2 class="text-xl font-semibold mb-3">Enabling IP Forwarding</h2>
              <p class="mb-3">By default, Linux does not forward packets between interfaces. To enable it:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Use <code>sysctl</code> to allow packet forwarding</li>
                <li>Update <code>/etc/sysctl.conf</code> for persistence</li>
              </ul>
              <p class="mb-3">This is essential to make Linux behave like a traditional router.</p>

              <h2 class="text-xl font-semibold mb-3">Routing Tables</h2>
              <p class="mb-3">Routing tables contain routes specifying:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Destination network</li>
                <li>Gateway IP</li>
                <li>Interface</li>
                <li>Metric (priority)</li>
              </ul>
              <p class="mb-3">Linux allows static routes and dynamic routing protocols (like OSPF/BGP via Quagga or FRRouting).</p>

              <h2 class="text-xl font-semibold mb-3">Static vs Dynamic Routing</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div class="bg-white/5 p-4 rounded-lg">
                  <h3 class="font-semibold mb-2">Static Routing</h3>
                  <p class="text-sm">Manual configuration, simple networks, predictable behavior.</p>
                </div>
                <div class="bg-white/5 p-4 rounded-lg">
                  <h3 class="font-semibold mb-2">Dynamic Routing</h3>
                  <p class="text-sm">Protocols like OSPF, RIP, BGP automatically update routing tables, ideal for large networks.</p>
                </div>
              </div>

              <h2 class="text-xl font-semibold mb-3">NAT on a Linux Router</h2>
              <p class="mb-3">Network Address Translation allows multiple devices on a private network to access external networks using a single public IP.</p>
              <p class="mb-3">Linux supports:</p>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>SNAT (Source NAT)</strong> – Outbound traffic translation</li>
                <li><strong>DNAT (Destination NAT)</strong> – Inbound traffic translation/port forwarding</li>
                <li><strong>MASQUERADE</strong> – Dynamic NAT, used on interfaces with changing IPs</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Routing with ip Command</h2>
              <p class="mb-3">Linux provides powerful tools like <code>ip route</code> and <code>ip rule</code> to manage routing. These commands can handle:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Default routes</li>
                <li>Multiple gateways</li>
                <li>Policy-based routing</li>
                <li>Traffic shaping</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Linux as a Firewall + Router Combo</h2>
              <p class="mb-3">By integrating iptables/nftables with IP forwarding, Linux can:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Filter traffic between networks</li>
                <li>Log suspicious activity</li>
                <li>Implement VLAN segregation and NAT</li>
                <li>Combine routing and firewalling in one machine</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Use Cases</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Home/office router replacement</li>
                <li>Enterprise lab for learning routing & VLANs</li>
                <li>VPN gateway with advanced routing</li>
                <li>Layer 3 switch replacement in small networks</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Best Practices</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Always enable IP forwarding securely</li>
                <li>Keep firewall rules tight</li>
                <li>Document all routes</li>
                <li>Use NAT carefully to avoid IP conflicts</li>
                <li>Test routing in isolated lab environments</li>
              </ul>
            </div>`
          ],
          syntaxPages: [
            `<div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-2">Enable IP Forwarding Temporarily</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>sysctl -w net.ipv4.ip_forward=1</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Enable IP Forwarding Permanently</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
sysctl -p</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Add a Static Route</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip route add 192.168.2.0/24 via 192.168.1.1 dev eth0</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">View Routing Table</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip route show</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Flush All Routes</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip route flush table main</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Configure NAT (Masquerade) with iptables</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">View Current iptables NAT Rules</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>iptables -t nat -L -n -v</code></pre>
              </div>
            </div>`,
            `<div class="space-y-6">
              <h2 class="text-xl font-semibold mb-3">Hands-On Implementation Guide</h2>
              <p class="mb-3"><strong>Guide Objective:</strong> Configure a Linux system to act as a basic router with NAT.</p>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 1: Enable IP Forwarding</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>sysctl -w net.ipv4.ip_forward=1</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 2: Configure Interfaces</h3>
                <p class="mb-2 text-sm text-gray-400">
                  eth0 → WAN/Internet<br />
                  eth1 → LAN/internal network
                </p>
                <p class="mb-2 text-sm">Assign IP addresses to interfaces:</p>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip addr add 192.168.1.1/24 dev eth1
ip addr add 10.0.0.1/24 dev eth2</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 3: Add Routes</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip route add 10.0.0.0/24 via 192.168.1.1</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 4: Configure NAT for Internet Access</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 5: Test Routing</h3>
                <ul class="list-disc ml-6 mt-2 text-sm">
                  <li>Ping between LAN interfaces</li>
                  <li>Verify internet access from LAN</li>
                  <li>Trace routes to external IPs</li>
                </ul>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Expected Outcome</h3>
                <ul class="list-disc ml-6 mt-2 text-sm">
                  <li>Linux system forwards packets between interfaces</li>
                  <li>LAN devices can reach WAN</li>
                  <li>NAT properly translates private IPs to public IP</li>
                  <li>Foundation ready for VLANs and firewall integration</li>
                </ul>
              </div>
            </div>`
          ]
        },
        {
          id: 'routing-tables',
          title: 'Topic 2: Routing Tables & Policy-Based Routing',
          theoryPages: [
            `<div>
              <h2 class="text-xl font-semibold mb-3">Routing Tables in Linux</h2>
              <p class="mb-3">A routing table is the heart of packet forwarding. It defines how packets should be directed based on the destination IP address.</p>
              <p class="mb-3">Each entry includes:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Destination network or host</li>
                <li>Gateway IP</li>
                <li>Outgoing interface</li>
                <li>Metric (priority of the route)</li>
              </ul>
              <p class="mb-3">Linux maintains a main routing table by default, but you can create custom tables for advanced routing policies.</p>

              <h2 class="text-xl font-semibold mb-3">View Current Routing Table</h2>
              <p class="mb-3">The routing table lists:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Default routes</li>
                <li>Network-specific routes</li>
                <li>Metrics for each route</li>
              </ul>
              <p class="mb-3">Linux uses the longest prefix match to determine which route to select when multiple routes exist.</p>

              <h2 class="text-xl font-semibold mb-3">Policy-Based Routing (PBR)</h2>
              <p class="mb-3">By default, Linux selects routes based only on destination IP. Policy-Based Routing allows routing decisions based on:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Source IP</li>
                <li>Protocol</li>
                <li>Packet mark</li>
                <li>Input interface</li>
                <li>TOS/DSCP fields</li>
              </ul>
              <p class="mb-3">PBR enables:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Multiple ISPs for load balancing</li>
                <li>VPN traffic routing</li>
                <li>Segmentation of traffic per department or service</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Linux Routing Rules</h2>
              <p class="mb-3">Linux uses <code>ip rule</code> to implement policy-based routing:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Assign traffic to a specific routing table</li>
                <li>Define conditions for selection</li>
                <li>Combine with <code>ip route</code> entries in custom tables</li>
              </ul>
              <p class="mb-3">Routing rules are evaluated in order of priority.</p>

              <h2 class="text-xl font-semibold mb-3">Use Cases of Policy-Based Routing</h2>
              <div class="space-y-3 mb-3">
                <div class="bg-white/5 p-4 rounded-lg">
                  <h3 class="font-semibold mb-2">Multi-WAN Load Balancing</h3>
                  <p class="text-sm">Split traffic across multiple ISPs based on source IP or service type.</p>
                </div>
                <div class="bg-white/5 p-4 rounded-lg">
                  <h3 class="font-semibold mb-2">VPN Traffic Routing</h3>
                  <p class="text-sm">Force traffic from certain subnets through VPN tunnels.</p>
                </div>
                <div class="bg-white/5 p-4 rounded-lg">
                  <h3 class="font-semibold mb-2">QoS Routing</h3>
                  <p class="text-sm">Route high-priority traffic differently.</p>
                </div>
                <div class="bg-white/5 p-4 rounded-lg">
                  <h3 class="font-semibold mb-2">Failover</h3>
                  <p class="text-sm">Automatically redirect traffic if one route fails.</p>
                </div>
              </div>

              <h2 class="text-xl font-semibold mb-3">Routing Table Example</h2>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>Main table</strong> – default table</li>
                <li><strong>Table 1 (vpn1)</strong> – routes VPN1 traffic</li>
                <li><strong>Table 2 (vpn2)</strong> – routes VPN2 traffic</li>
              </ul>
              <p class="mb-3">This separation allows fine-grained routing control.</p>

              <h2 class="text-xl font-semibold mb-3">Best Practices</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Document custom tables and rules</li>
                <li>Use unique table IDs</li>
                <li>Keep the default table clean</li>
                <li>Test policies with ping and traceroute</li>
                <li>Combine PBR with firewall rules for security</li>
              </ul>
            </div>`
          ],
          syntaxPages: [
            `<div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-2">View Routing Table</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip route show</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Add a Static Route</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip route add 192.168.2.0/24 via 192.168.1.1 dev eth0</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">View Routing Rules</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip rule show</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Add a Routing Rule</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip rule add from 192.168.1.0/24 table 1</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Add a Route to a Custom Table</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip route add default via 10.0.0.1 dev eth1 table 1</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Flush Rules or Tables</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip rule flush
ip route flush table 1</code></pre>
              </div>
            </div>`,
            `<div class="space-y-6">
              <h2 class="text-xl font-semibold mb-3">Hands-On Implementation Guide</h2>
              <p class="mb-3"><strong>Guide Objective:</strong> Create multiple routing tables and implement policy-based routing.</p>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 1: Create a Custom Table</h3>
                <p class="mb-2 text-sm text-gray-400">Edit /etc/iproute2/rt_tables:</p>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>1 vpn1
2 vpn2</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 2: Add Routes to Tables</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip route add 10.10.0.0/16 via 192.168.1.1 dev eth0 table vpn1
ip route add 172.16.0.0/16 via 192.168.2.1 dev eth1 table vpn2</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 3: Create Routing Rules</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip rule add from 10.10.1.0/24 table vpn1
ip rule add from 172.16.1.0/24 table vpn2</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 4: Verify</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip rule show
ip route show table vpn1
ip route show table vpn2</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 5: Test</h3>
                <ul class="list-disc ml-6 mt-2 text-sm">
                  <li>Ping from different source IPs</li>
                  <li>Confirm traffic uses correct gateway</li>
                  <li>Trace route to verify path</li>
                </ul>
              </div>
            </div>`
          ]
        },
        {
          id: 'vlan-creation',
          title: 'Topic 3: VLAN Creation with vconfig / ip link',
          theoryPages: [
            `<div>
              <h2 class="text-xl font-semibold mb-3">What is a VLAN?</h2>
              <p class="mb-3">A VLAN (Virtual Local Area Network) is a logical segmentation of a physical network. It allows multiple networks to coexist on the same physical infrastructure while keeping traffic isolated.</p>
              <p class="mb-3">Benefits of VLANs:</p>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>Security:</strong> Devices in different VLANs cannot directly communicate unless routed</li>
                <li><strong>Performance:</strong> Reduces broadcast domains and congestion</li>
                <li><strong>Flexibility:</strong> Logical segmentation independent of physical topology</li>
                <li><strong>Simplified management:</strong> Departments or services can be separated easily</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">VLANs in Linux</h2>
              <p class="mb-3">Linux supports VLANs using:</p>
              <ul class="list-disc ml-6 mb-3">
                <li><code>vconfig</code> (older tool, now deprecated in some distributions)</li>
                <li><code>ip link</code> (modern tool, preferred)</li>
              </ul>
              <p class="mb-3">Each VLAN is represented as a virtual interface linked to a physical NIC. Example:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Physical NIC: <code>eth0</code></li>
                <li>VLAN 10: <code>eth0.10</code></li>
                <li>VLAN 20: <code>eth0.20</code></li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">VLAN Tagging</h2>
              <p class="mb-3">VLAN tagging follows the IEEE 802.1Q standard. Each Ethernet frame includes a 4-byte tag:</p>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>VLAN ID:</strong> identifies the VLAN (1–4094)</li>
                <li><strong>Priority Code Point (PCP):</strong> QoS priority</li>
                <li><strong>Canonical Format Identifier (CFI):</strong> compatibility bit</li>
              </ul>
              <p class="mb-3">Tagged frames allow switches and Linux to recognize VLAN membership.</p>

              <h2 class="text-xl font-semibold mb-3">Use Cases of VLANs</h2>
              <div class="space-y-3 mb-3">
                <div class="bg-white/5 p-4 rounded-lg">
                  <h3 class="font-semibold mb-2">Department Segmentation</h3>
                  <p class="text-sm">HR, IT, Finance in separate VLANs.</p>
                </div>
                <div class="bg-white/5 p-4 rounded-lg">
                  <h3 class="font-semibold mb-2">Guest Wi-Fi Isolation</h3>
                  <p class="text-sm">Prevents guest access to internal network.</p>
                </div>
                <div class="bg-white/5 p-4 rounded-lg">
                  <h3 class="font-semibold mb-2">VoIP Traffic</h3>
                  <p class="text-sm">VLAN for voice traffic with QoS priority.</p>
                </div>
                <div class="bg-white/5 p-4 rounded-lg">
                  <h3 class="font-semibold mb-2">Lab or Test Environments</h3>
                  <p class="text-sm">Multiple isolated networks on the same server.</p>
                </div>
              </div>

              <h2 class="text-xl font-semibold mb-3">Linux VLAN Workflow</h2>
              <ol class="list-decimal ml-6 mb-3 space-y-2">
                <li>Create VLAN interface</li>
                <li>Assign VLAN ID</li>
                <li>Assign IP address</li>
                <li>Configure routes or firewall rules</li>
                <li>Test connectivity</li>
              </ol>

              <h2 class="text-xl font-semibold mb-3">Advantages of Using ip link vs vconfig</h2>
              <ul class="list-disc ml-6 mb-3">
                <li><code>ip link</code> is part of iproute2 (modern Linux)</li>
                <li>Supports advanced configurations and persistence</li>
                <li>Easier integration with scripts</li>
                <li><code>vconfig</code> is largely deprecated</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Best Practices</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Document VLAN IDs and purposes</li>
                <li>Avoid overlapping VLAN IDs</li>
                <li>Use consistent tagging on switches and Linux</li>
                <li>Monitor VLAN interfaces for traffic and errors</li>
                <li>Combine with routing and firewall rules for inter-VLAN communication</li>
              </ul>
            </div>`
          ],
          syntaxPages: [
            `<div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-2">Create VLAN using ip link</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip link add link eth0 name eth0.10 type vlan id 10</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Assign IP to VLAN Interface</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip addr add 192.168.10.1/24 dev eth0.10</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Bring VLAN Interface Up</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip link set dev eth0.10 up</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">View VLAN Interfaces</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip -d link show</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Delete VLAN Interface</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip link delete eth0.10</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Optional: vconfig (Older Method)</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>vconfig add eth0 10
ifconfig eth0.10 192.168.10.1 up</code></pre>
              </div>
            </div>`,
            `<div class="space-y-6">
              <h2 class="text-xl font-semibold mb-3">Hands-On Implementation Guide</h2>
              <p class="mb-3"><strong>Guide Objective:</strong> Create VLANs on Linux and configure IP addressing for isolated networks.</p>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 1: Create VLAN Interface</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip link add link eth0 name eth0.10 type vlan id 10
ip link add link eth0 name eth0.20 type vlan id 20</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 2: Assign IP Addresses</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip addr add 192.168.10.1/24 dev eth0.10
ip addr add 192.168.20.1/24 dev eth0.20</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 3: Bring Interfaces Up</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip link set dev eth0.10 up
ip link set dev eth0.20 up</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 4: Verify VLANs</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip -d link show</code></pre>
                <ul class="list-disc ml-6 mt-2 text-sm">
                  <li>Ensure VLAN interfaces exist</li>
                  <li>Check VLAN IDs</li>
                </ul>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 5: Test Connectivity</h3>
                <ul class="list-disc ml-6 mt-2 text-sm">
                  <li>Ping devices within same VLAN</li>
                  <li>Attempt cross-VLAN ping (should fail if no routing)</li>
                </ul>
              </div>
            </div>`
          ]
        },
        {
          id: 'bonding-aggregation',
          title: 'Topic 4: Bonding & Link Aggregation (LACP)',
          theoryPages: [
            `<div>
              <h2 class="text-xl font-semibold mb-3">What is Link Bonding / Aggregation?</h2>
              <p class="mb-3">Link bonding or link aggregation combines multiple network interfaces into a single logical interface to:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Increase bandwidth</li>
                <li>Provide redundancy</li>
                <li>Improve fault tolerance</li>
              </ul>
              <p class="mb-3">In Linux, this is implemented via the bonding driver and can be configured for different modes, including LACP (IEEE 802.3ad).</p>

              <h2 class="text-xl font-semibold mb-3">Benefits of Bonding</h2>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>Increased Throughput:</strong> Aggregate bandwidth of multiple NICs</li>
                <li><strong>Redundancy / Failover:</strong> One NIC failure does not disrupt connectivity</li>
                <li><strong>Load Balancing:</strong> Distribute traffic across multiple NICs</li>
                <li><strong>Simplified Network Management:</strong> Single IP on multiple interfaces</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Bonding Modes</h2>
              <p class="mb-3">Linux supports several modes of bonding:</p>
              <div class="overflow-x-auto mb-3">
                <table class="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr class="border-b border-gray-700">
                      <th class="p-2">Mode</th>
                      <th class="p-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b border-gray-800">
                      <td class="p-2">balance-rr (0)</td>
                      <td class="p-2">Round-robin load balancing</td>
                    </tr>
                    <tr class="border-b border-gray-800">
                      <td class="p-2">active-backup (1)</td>
                      <td class="p-2">Only one NIC active; failover on failure</td>
                    </tr>
                    <tr class="border-b border-gray-800">
                      <td class="p-2">balance-xor (2)</td>
                      <td class="p-2">Transmit based on MAC XOR; deterministic load balancing</td>
                    </tr>
                    <tr class="border-b border-gray-800">
                      <td class="p-2">broadcast (3)</td>
                      <td class="p-2">Sends packets on all NICs (for redundancy)</td>
                    </tr>
                    <tr class="border-b border-gray-800">
                      <td class="p-2">802.3ad (4)</td>
                      <td class="p-2">LACP; dynamic link aggregation (requires switch support)</td>
                    </tr>
                    <tr class="border-b border-gray-800">
                      <td class="p-2">balance-tlb (5)</td>
                      <td class="p-2">Adaptive transmit load balancing</td>
                    </tr>
                    <tr class="border-b border-gray-800">
                      <td class="p-2">balance-alb (6)</td>
                      <td class="p-2">Adaptive load balancing (transmit & receive)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p class="mb-3">LACP (Mode 4) is most common in enterprise networks because it provides both bandwidth aggregation and redundancy, while coordinating with the switch dynamically.</p>

              <h2 class="text-xl font-semibold mb-3">How LACP Works</h2>
              <ul class="list-decimal ml-6 mb-3">
                <li>Linux NICs send LACP protocol packets to the switch</li>
                <li>Switch groups NICs into a single logical link</li>
                <li>Traffic is distributed among NICs according to hashing algorithms</li>
                <li>If one NIC fails, LACP automatically redistributes traffic</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Use Cases</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Data centers to increase server uplink bandwidth</li>
                <li>Virtualization hosts with high network demand</li>
                <li>Redundant enterprise server connections</li>
                <li>NAS or storage systems requiring high throughput</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Best Practices</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Use identical NICs for aggregation</li>
                <li>Ensure switch supports LACP and configure ports accordingly</li>
                <li>Monitor link status and bonding metrics</li>
                <li>Use VLANs over bonded interfaces if segmentation is needed</li>
                <li>Document bonding configuration</li>
              </ul>
            </div>`
          ],
          syntaxPages: [
            `<div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-2">Load Bonding Module</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>modprobe bonding</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Create Bonding Interface</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip link add bond0 type bond mode 802.3ad</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Add NICs to Bond</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip link set eth0 master bond0
ip link set eth1 master bond0</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Bring Interfaces Up</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip link set dev eth0 up
ip link set dev eth1 up
ip link set dev bond0 up</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Assign IP to Bond</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip addr add 192.168.1.100/24 dev bond0</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Verify Bond Status</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>cat /proc/net/bonding/bond0</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Remove Bond</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip link delete bond0</code></pre>
              </div>
            </div>`,
            `<div class="space-y-6">
              <h2 class="text-xl font-semibold mb-3">Hands-On Implementation Guide</h2>
              <p class="mb-3"><strong>Guide Objective:</strong> Create a bonded interface using LACP and configure redundancy and load balancing.</p>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 1: Load Bonding Module</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>modprobe bonding</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 2: Create Bond Interface</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip link add bond0 type bond mode 802.3ad</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 3: Add Physical NICs</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip link set eth0 master bond0
ip link set eth1 master bond0</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 4: Bring Interfaces Up</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip link set dev eth0 up
ip link set dev eth1 up
ip link set dev bond0 up</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 5: Assign IP</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip addr add 192.168.1.100/24 dev bond0</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 6: Verify Configuration</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>cat /proc/net/bonding/bond0</code></pre>
                <ul class="list-disc ml-6 mt-2 text-sm">
                  <li>Ensure mode is 802.3ad</li>
                  <li>Verify NICs are active</li>
                  <li>Check link aggregation status</li>
                </ul>
              </div>
            </div>`
          ]
        },
        {
          id: 'bridging-interfaces',
          title: 'Topic 5: Bridging Interfaces',
          theoryPages: [
            `<div>
              <h2 class="text-xl font-semibold mb-3">What is a Network Bridge?</h2>
              <p class="mb-3">A network bridge connects two or more network segments at Layer 2 (Data Link Layer), allowing devices on separate interfaces to communicate as if they are on the same network.</p>
              <p class="mb-3">Linux bridging is commonly used for:</p>
              <ul class="list-disc ml-6 mb-3">
                <li>Virtualization (VM networking)</li>
                <li>Connecting VLANs</li>
                <li>LAN segment aggregation</li>
                <li>Transparent firewall setups</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Why Bridging is Important</h2>
              <p class="mb-3">Bridging in Linux allows:</p>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>Transparent Traffic Forwarding:</strong> No IP-level routing required</li>
                <li><strong>Virtual Network Connectivity:</strong> Virtual machines can communicate with the LAN</li>
                <li><strong>VLAN Integration:</strong> Bridges can include VLAN interfaces</li>
                <li><strong>Simplified Network Topology:</strong> Reduces complexity for certain setups</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">How a Bridge Works</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Acts like a virtual switch</li>
                <li>Maintains a MAC address table</li>
                <li>Forwards frames based on MAC addresses</li>
                <li>Can connect physical NICs and VLAN interfaces</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Use Cases</h2>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>KVM/QEMU Virtualization:</strong> VMs use bridge to access physical network</li>
                <li><strong>Container Networking:</strong> Docker/LXD bridge networks for containers</li>
                <li><strong>Inter-VLAN Connectivity:</strong> Combine VLAN interfaces in a bridge for communication</li>
                <li><strong>Transparent Firewall / IDS:</strong> Bridge traffic through security appliances</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Bridge vs Router</h2>
              <div class="overflow-x-auto mb-3">
                <table class="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr class="border-b border-gray-700">
                      <th class="p-2">Feature</th>
                      <th class="p-2">Bridge</th>
                      <th class="p-2">Router</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b border-gray-800">
                      <td class="p-2">Layer</td>
                      <td class="p-2">2 (MAC)</td>
                      <td class="p-2">3 (IP)</td>
                    </tr>
                    <tr class="border-b border-gray-800">
                      <td class="p-2">Segment Traffic</td>
                      <td class="p-2">Yes</td>
                      <td class="p-2">Yes</td>
                    </tr>
                    <tr class="border-b border-gray-800">
                      <td class="p-2">VLAN Handling</td>
                      <td class="p-2">Supported</td>
                      <td class="p-2">Not needed</td>
                    </tr>
                    <tr class="border-b border-gray-800">
                      <td class="p-2">IP Required</td>
                      <td class="p-2">Optional</td>
                      <td class="p-2">Required</td>
                    </tr>
                    <tr class="border-b border-gray-800">
                      <td class="p-2">Use Case</td>
                      <td class="p-2">LAN, VM networks</td>
                      <td class="p-2">WAN, VLAN routing</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 class="text-xl font-semibold mb-3">Best Practices</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Keep bridge interfaces simple for clarity</li>
                <li>Avoid bridging loops without STP (Spanning Tree Protocol)</li>
                <li>Combine with VLANs carefully</li>
                <li>Monitor bridge performance for high traffic</li>
                <li>Document interfaces included in each bridge</li>
              </ul>
            </div>`
          ],
          syntaxPages: [
            `<div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-2">Create a Bridge Interface</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip link add name br0 type bridge</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Add Interfaces to Bridge</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip link set eth0 master br0
ip link set eth1 master br0</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Bring Bridge and Interfaces Up</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip link set dev br0 up
ip link set dev eth0 up
ip link set dev eth1 up</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Assign IP to Bridge</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip addr add 192.168.1.1/24 dev br0</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">View Bridge Details</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>bridge link
bridge vlan
bridge fdb show</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Delete a Bridge</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip link delete br0 type bridge</code></pre>
              </div>
            </div>`,
            `<div class="space-y-6">
              <h2 class="text-xl font-semibold mb-3">Hands-On Implementation Guide</h2>
              <p class="mb-3"><strong>Guide Objective:</strong> Create a Linux bridge to connect multiple interfaces for Layer 2 communication.</p>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 1: Create Bridge</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip link add name br0 type bridge</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 2: Add Physical Interfaces</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip link set eth0 master br0
ip link set eth1 master br0</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 3: Bring Interfaces Up</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip link set dev eth0 up
ip link set dev eth1 up
ip link set dev br0 up</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 4: Assign IP Address</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip addr add 192.168.1.1/24 dev br0</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 5: Verify Bridge</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>bridge link
bridge fdb show</code></pre>
                <ul class="list-disc ml-6 mt-2 text-sm">
                  <li>Confirm interfaces are attached</li>
                  <li>Check MAC table entries</li>
                  <li>Ensure devices can communicate</li>
                </ul>
              </div>
            </div>`
          ]
        },
        {
          id: 'dhcp-server',
          title: 'Topic 6: DHCP Server Setup (dnsmasq / isc-dhcp)',
          theoryPages: [
            `<div>
              <h2 class="text-xl font-semibold mb-3">What is DHCP?</h2>
              <p class="mb-3">DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses and network configuration (gateway, DNS, subnet mask) to clients on a network.</p>
              <h3 class="text-lg font-semibold mb-2">Benefits</h3>
              <ul class="list-disc ml-6 mb-3">
                <li>Eliminates manual IP configuration</li>
                <li>Reduces human errors</li>
                <li>Provides centralized control</li>
                <li>Enables rapid deployment of devices</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Linux DHCP Servers</h2>
              <p class="mb-3">Two commonly used DHCP servers on Linux:</p>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>dnsmasq:</strong> Lightweight, simple, ideal for small to medium networks. Provides DHCP, DNS caching, and TFTP.</li>
                <li><strong>isc-dhcp-server:</strong> Full-featured, suitable for enterprise networks. Supports advanced DHCP options, leases, and failover.</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">How DHCP Works</h2>
              <ul class="list-decimal ml-6 mb-3">
                <li><strong>Discover:</strong> Client broadcasts request for IP</li>
                <li><strong>Offer:</strong> Server offers an available IP</li>
                <li><strong>Request:</strong> Client requests the offered IP</li>
                <li><strong>Acknowledgment:</strong> Server confirms and assigns IP</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">DHCP Configuration Concepts</h2>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>Subnet declaration:</strong> Define network range for clients</li>
                <li><strong>Range:</strong> IP addresses available for assignment</li>
                <li><strong>Lease time:</strong> Duration client can use IP</li>
                <li><strong>Options:</strong> Gateway, DNS, broadcast, etc.</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">dnsmasq vs isc-dhcp-server</h2>
              <div class="overflow-x-auto mb-3">
                <table class="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr class="border-b border-gray-700">
                      <th class="p-2">Feature</th>
                      <th class="p-2">dnsmasq</th>
                      <th class="p-2">isc-dhcp-server</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b border-gray-800">
                      <td class="p-2">Lightweight</td>
                      <td class="p-2">✅</td>
                      <td class="p-2">❌</td>
                    </tr>
                    <tr class="border-b border-gray-800">
                      <td class="p-2">DNS Caching</td>
                      <td class="p-2">✅</td>
                      <td class="p-2">❌</td>
                    </tr>
                    <tr class="border-b border-gray-800">
                      <td class="p-2">Enterprise options</td>
                      <td class="p-2">❌</td>
                      <td class="p-2">✅</td>
                    </tr>
                    <tr class="border-b border-gray-800">
                      <td class="p-2">Lease Management</td>
                      <td class="p-2">Simple</td>
                      <td class="p-2">Advanced</td>
                    </tr>
                    <tr class="border-b border-gray-800">
                      <td class="p-2">Complexity</td>
                      <td class="p-2">Low</td>
                      <td class="p-2">Medium-High</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 class="text-xl font-semibold mb-3">Use Cases</h2>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>dnsmasq:</strong> Home labs, virtual machines, small offices</li>
                <li><strong>isc-dhcp-server:</strong> Enterprise LANs, VLANs, high-scale deployments</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Best Practices</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Always reserve IPs for critical devices (servers, routers)</li>
                <li>Monitor leases and logs for conflicts</li>
                <li>Separate DHCP servers per VLAN if needed</li>
                <li>Combine with firewall rules to protect DHCP traffic</li>
                <li>Document network ranges and options</li>
              </ul>
            </div>`
          ],
          syntaxPages: [
            `<div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-2">Install dnsmasq</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>apt install dnsmasq -y</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Basic dnsmasq Configuration</h3>
                <p class="mb-1 text-sm text-gray-400">Edit /etc/dnsmasq.conf:</p>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>interface=eth0
dhcp-range=192.168.10.100,192.168.10.200,12h
dhcp-option=3,192.168.10.1   # Gateway
dhcp-option=6,8.8.8.8         # DNS</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Start and Enable dnsmasq</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>systemctl start dnsmasq
systemctl enable dnsmasq</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Install isc-dhcp-server</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>apt install isc-dhcp-server -y</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Basic isc-dhcp-server Configuration</h3>
                <p class="mb-1 text-sm text-gray-400">Edit /etc/dhcp/dhcpd.conf:</p>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>subnet 192.168.10.0 netmask 255.255.255.0 {
    range 192.168.10.100 192.168.10.200;
    option routers 192.168.10.1;
    option domain-name-servers 8.8.8.8, 8.8.4.4;
    default-lease-time 3600;
    max-lease-time 7200;
}</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Start and Enable isc-dhcp-server</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>systemctl start isc-dhcp-server
systemctl enable isc-dhcp-server</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Check Leases</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>cat /var/lib/dhcp/dhcpd.leases</code></pre>
              </div>
            </div>`,
            `<div class="space-y-6">
              <h2 class="text-xl font-semibold mb-3">Hands-On Implementation Guide</h2>
              <p class="mb-3"><strong>Guide Objective:</strong> Setup a DHCP server in Linux using dnsmasq or isc-dhcp-server to automatically assign IP addresses to clients.</p>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 1: Install DHCP Server</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>apt install dnsmasq -y
# OR
apt install isc-dhcp-server -y</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 2: Configure DHCP Range</h3>
                <p class="mb-1 text-sm text-gray-400">dnsmasq example (/etc/dnsmasq.conf):</p>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>interface=eth0
dhcp-range=192.168.10.100,192.168.10.200,12h
dhcp-option=3,192.168.10.1
dhcp-option=6,8.8.8.8</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 3: Start DHCP Service</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>systemctl start dnsmasq
systemctl enable dnsmasq</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 4: Test DHCP Assignment</h3>
                <p class="mb-1">Connect a client to eth0 and verify IP:</p>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip addr show</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 5: Monitor Leases</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>cat /var/lib/misc/dnsmasq.leases</code></pre>
                <ul class="list-disc ml-6 mt-2 text-sm">
                  <li>Check assigned IPs and MAC addresses</li>
                  <li>Ensure no conflicts</li>
                </ul>
              </div>
            </div>`
          ]
        },
        {
          id: 'mini-enterprise-network',
          title: 'Topic 7: Mini Enterprise Network Creation in Linux',
          theoryPages: [
            `<div>
              <h2 class="text-xl font-semibold mb-3">Objective</h2>
              <p class="mb-3">This topic focuses on combining all previous concepts—routing, VLANs, bridging, bonding, and DHCP—to create a fully functional mini enterprise network on Linux. The goal is to simulate a realistic enterprise environment for learning, testing, and experimentation.</p>

              <h2 class="text-xl font-semibold mb-3">Components of a Mini Enterprise Network</h2>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>Multiple VLANs:</strong> Segregate departments like HR, IT, Finance</li>
                <li><strong>Inter-VLAN Routing:</strong> Connect VLANs through Linux router</li>
                <li><strong>DHCP Services:</strong> Automatic IP assignment per VLAN</li>
                <li><strong>Bridging:</strong> Connect virtual machines or containers to physical network</li>
                <li><strong>Bonding/LACP:</strong> Redundant and high-speed uplinks</li>
                <li><strong>Firewall Rules:</strong> Secure network traffic between VLANs and WAN</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Planning the Network</h2>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>Subnetting:</strong> Assign a unique subnet to each VLAN</li>
                <li><strong>Routing:</strong> Plan default routes and inter-VLAN routes</li>
                <li><strong>IP Assignment:</strong> Reserve static IPs for routers, servers, gateways</li>
                <li><strong>Redundancy:</strong> Use bonding for critical links</li>
                <li><strong>Security:</strong> Implement firewall rules to control access</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Example Layout</h2>
              <div class="overflow-x-auto mb-3">
                <table class="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr class="border-b border-gray-700">
                      <th class="p-2">VLAN</th>
                      <th class="p-2">Department</th>
                      <th class="p-2">Subnet</th>
                      <th class="p-2">Gateway</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b border-gray-800">
                      <td class="p-2">VLAN 10</td>
                      <td class="p-2">HR</td>
                      <td class="p-2">192.168.10.0/24</td>
                      <td class="p-2">192.168.10.1</td>
                    </tr>
                    <tr class="border-b border-gray-800">
                      <td class="p-2">VLAN 20</td>
                      <td class="p-2">IT</td>
                      <td class="p-2">192.168.20.0/24</td>
                      <td class="p-2">192.168.20.1</td>
                    </tr>
                    <tr class="border-b border-gray-800">
                      <td class="p-2">VLAN 30</td>
                      <td class="p-2">Finance</td>
                      <td class="p-2">192.168.30.0/24</td>
                      <td class="p-2">192.168.30.1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <ul class="list-disc ml-6 mb-3">
                <li>Linux Router handles inter-VLAN routing and NAT for WAN</li>
                <li>DHCP assigns IPs dynamically within VLANs</li>
                <li>Bridge connects virtual lab devices to VLANs</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Tools & Services Required</h2>
              <ul class="list-disc ml-6 mb-3">
                <li><strong>ip link / vconfig:</strong> VLAN creation</li>
                <li><strong>ip route / ip rule:</strong> Routing and PBR</li>
                <li><strong>dnsmasq / isc-dhcp-server:</strong> DHCP per VLAN</li>
                <li><strong>bridge-utils / ip link:</strong> Bridging</li>
                <li><strong>iptables / nftables:</strong> Firewall & NAT</li>
                <li><strong>bonding:</strong> Link aggregation for redundancy</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Use Cases</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Lab environment for training and simulations</li>
                <li>Small enterprise network setup for testing</li>
                <li>Pre-deployment testing of VLAN, routing, and DHCP configurations</li>
                <li>Network troubleshooting exercises</li>
              </ul>

              <h2 class="text-xl font-semibold mb-3">Best Practices</h2>
              <ul class="list-disc ml-6 mb-3">
                <li>Document VLAN IDs, IPs, and subnet masks</li>
                <li>Use separate routing tables for complex setups</li>
                <li>Implement backup DHCP and redundant links</li>
                <li>Regularly monitor network with SNMP/Nagios/Zabbix</li>
                <li>Test inter-VLAN communication and firewall policies</li>
              </ul>
            </div>`
          ],
          syntaxPages: [
            `<div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-2">Create VLAN Interfaces</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip link add link eth0 name eth0.10 type vlan id 10
ip link add link eth0 name eth0.20 type vlan id 20
ip link add link eth0 name eth0.30 type vlan id 30

ip link set dev eth0.10 up
ip link set dev eth0.20 up
ip link set dev eth0.30 up</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Assign IPs for VLAN Gateways</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip addr add 192.168.10.1/24 dev eth0.10
ip addr add 192.168.20.1/24 dev eth0.20
ip addr add 192.168.30.1/24 dev eth0.30</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Add Routes for Inter-VLAN Communication</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip route add 192.168.10.0/24 dev eth0.10
ip route add 192.168.20.0/24 dev eth0.20
ip route add 192.168.30.0/24 dev eth0.30</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Configure DHCP per VLAN (dnsmasq example)</h3>
                <p class="mb-1 text-sm text-gray-400">In /etc/dnsmasq.conf:</p>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>interface=eth0.10
dhcp-range=192.168.10.100,192.168.10.200,12h

interface=eth0.20
dhcp-range=192.168.20.100,192.168.20.200,12h

interface=eth0.30
dhcp-range=192.168.30.100,192.168.30.200,12h</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Setup NAT for WAN Access</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>iptables -t nat -A POSTROUTING -o eth1 -j MASQUERADE</code></pre>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-2">Optional: Bridge for Virtual Machines</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip link add name br0 type bridge
ip link set dev eth0.10 master br0
ip link set dev br0 up</code></pre>
              </div>
            </div>`,
            `<div class="space-y-6">
              <h2 class="text-xl font-semibold mb-3">Hands-On Implementation Guide</h2>
              <p class="mb-3"><strong>Guide Objective:</strong> Build a full mini enterprise network using VLANs, routing, DHCP, NAT, and bridging.</p>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 1: Plan VLANs and Subnets</h3>
                <ul class="list-disc ml-6 mb-2 text-sm">
                  <li>VLAN 10 → HR → 192.168.10.0/24</li>
                  <li>VLAN 20 → IT → 192.168.20.0/24</li>
                  <li>VLAN 30 → Finance → 192.168.30.0/24</li>
                </ul>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 2: Create VLAN Interfaces</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip link add link eth0 name eth0.10 type vlan id 10
ip link add link eth0 name eth0.20 type vlan id 20
ip link add link eth0 name eth0.30 type vlan id 30
ip link set dev eth0.10 up
ip link set dev eth0.20 up
ip link set dev eth0.30 up</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 3: Assign Gateway IPs</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>ip addr add 192.168.10.1/24 dev eth0.10
ip addr add 192.168.20.1/24 dev eth0.20
ip addr add 192.168.30.1/24 dev eth0.30</code></pre>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 4: Setup DHCP for Each VLAN</h3>
                <p class="mb-1 text-sm">Configure dnsmasq or isc-dhcp-server as shown in Syntax tab, then verify clients receive correct IPs.</p>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 5: Configure NAT and Firewall</h3>
                <pre class="bg-black/70 text-white rounded-md p-3 overflow-auto text-sm"><code>iptables -t nat -A POSTROUTING -o eth1 -j MASQUERADE</code></pre>
                <p class="mt-2 text-sm">This protects VLANs while allowing WAN access via the router's uplink (eth1).</p>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Step 6: Test Connectivity</h3>
                <ul class="list-disc ml-6 mt-2 text-sm">
                  <li>Ping across VLANs via router</li>
                  <li>Test DHCP assignment</li>
                  <li>Check NAT and internet access</li>
                </ul>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Expected Outcome</h3>
                <ul class="list-disc ml-6 mt-2 text-sm">
                  <li>Mini enterprise network fully operational</li>
                  <li>VLANs segregated and interconnected via Linux router</li>
                  <li>DHCP and NAT functioning properly</li>
                  <li>Bridging allows VMs or containers to participate</li>
                </ul>
              </div>
            </div>`
          ]
        },
      ],
    },
);

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

// Terminal Simulation Component
const TerminalSimulation = () => {
  const [history, setHistory] = useState<string[]>(['Welcome to the Ubuntu Terminal.', 'Type commands below (e.g., nmap, ping, ufw, ip a).']);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState('~');
  const [installed, setInstalled] = useState<Set<string>>(new Set(['ufw', 'iproute2', 'iptables', 'coreutils', 'bash', 'nmap', 'iputils-ping', 'net-tools', 'dnsutils', 'traceroute', 'wireguard', 'openvpn', 'tcpdump', 'curl', 'wget']));
  const [fileSystem, setFileSystem] = useState<Record<string, string[]>>({
    '~': ['readme.txt', 'scripts/'],
    '~/scripts': ['scan.sh', 'backup.sh'],
    '~/openvpn-ca': ['pki/', 'vars'],
    '/etc': ['sysctl.conf', 'passwd', 'hosts'],
    '/var/log': ['syslog', 'auth.log'],
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      setHistory(prev => [...prev, `root@ubuntu:${cwd}# ${cmd}`]);
      
      if (cmd) {
        const pipeParts = cmd.split('|');
        const mainCmdStr = pipeParts[0].trim();
        const grepPart = pipeParts.slice(1).find(p => p.trim().startsWith('grep'));
        const grepPattern = grepPart ? grepPart.trim().split(/\s+/)[1] : null;

        const parts = mainCmdStr.split(/\s+/);
        const base = parts[0];
        const args = parts.slice(1);

        let outputBuffer: string[] = [];
        const log = (msg: string) => {
             if (grepPattern) {
                 outputBuffer.push(msg);
             } else {
                 setHistory(prev => [...prev, msg]);
             }
        };

        switch (base) {
          case 'clear':
            setHistory([]);
            break;
          case 'ls': {
            const files = fileSystem[cwd] || [];
            log(files.join('  '));
            break;
          }
          case 'pwd':
            log(cwd === '~' ? '/root' : cwd.replace('~', '/root'));
            break;
          case 'whoami':
            log('root');
            break;
          case 'cd':
            if (!args[0] || args[0] === '~') {
              setCwd('~');
            } else if (args[0] === '..') {
              if (cwd === '~') setCwd('/root');
              else if (cwd.includes('/')) {
                  const p = cwd.split('/');
                  p.pop();
                  setCwd(p.join('/') || '/');
              }
            } else {
              setCwd(args[0].startsWith('/') ? args[0] : `${cwd === '~' ? '~' : cwd}/${args[0]}`);
            }
            break;
          case 'echo':
            log(args.join(' '));
            break;
          case 'cat':
             log(args[0] === 'readme.txt' ? 'Welcome to the lab environment.' : `cat: ${args[0]}: No such file or directory`);
             break;
          case 'nmap': {
             if (!installed.has('nmap')) { log('bash: nmap: command not found'); break; }
             const target = args[args.length - 1] || 'localhost';
             log(`Starting Nmap 7.80 ( https://nmap.org ) at ${new Date().toISOString().split('T')[0]}`);
             log(`Nmap scan report for ${target} (192.168.1.1)`);
             log('Host is up (0.00013s latency).');
             log('Not shown: 997 closed ports');
             log('PORT     STATE SERVICE');
             log('22/tcp   open  ssh');
             log('80/tcp   open  http');
             log('443/tcp  open  https');
             if (args.includes('-O')) {
                 log('Device type: general purpose');
                 log('Running: Linux 4.X|5.X');
                 log('OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5');
                 log('OS details: Linux 4.15 - 5.6');
             }
             log(`\nNmap done: 1 IP address (1 host up) scanned in 1.52 seconds`);
             break;
          }
          case 'ping': {
             if (!installed.has('iputils-ping') && !installed.has('ping')) { log('bash: ping: command not found'); break; }
             const dest = args[0] || 'google.com';
             log(`PING ${dest} (142.250.183.46) 56(84) bytes of data.`);
             log(`64 bytes from ${dest} (142.250.183.46): icmp_seq=1 ttl=116 time=12.3 ms`);
             log(`64 bytes from ${dest} (142.250.183.46): icmp_seq=2 ttl=116 time=11.8 ms`);
             log(`64 bytes from ${dest} (142.250.183.46): icmp_seq=3 ttl=116 time=12.1 ms`);
             log(`--- ${dest} ping statistics ---`);
             log('3 packets transmitted, 3 received, 0% packet loss, time 2003ms');
             break;
          }
          case 'traceroute':
          case 'tracepath':
             log(`traceroute to ${args[0] || 'google.com'} (142.250.183.46), 30 hops max, 60 byte packets`);
             log(' 1  _gateway (10.0.2.2)  0.421 ms  0.358 ms  0.299 ms');
             log(' 2  192.168.1.1 (192.168.1.1)  1.203 ms  1.156 ms  1.120 ms');
             log(' 3  142.250.183.46 (142.250.183.46)  12.345 ms  12.210 ms  12.180 ms');
             break;
          case 'netstat':
          case 'ss':
             log('Active Internet connections (servers and established)');
             log('Proto Recv-Q Send-Q Local Address           Foreign Address         State');
             log('tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN');
             log('tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN');
             log('tcp        0      0 10.0.2.15:22            10.0.2.2:54321          ESTABLISHED');
             break;
          case 'dig':
          case 'nslookup': {
             const domain = args[0] || 'google.com';
             log(`; <<>> DiG 9.16.1-Ubuntu <<>> ${domain}`);
             log(';; global options: +cmd');
             log(';; Got answer:');
             log(';; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345');
             log(';; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1');
             log(`;; QUESTION SECTION:\n;${domain}.\t\t\tIN\tA`);
             log(`;; ANSWER SECTION:\n${domain}.\t\t300\tIN\tA\t142.250.183.46`);
             log(';; Query time: 12 msec');
             break;
          }
          case 'apt':
            if (args[0] === 'update') {
              log('Hit:1 http://archive.ubuntu.com/ubuntu focal InRelease');
              log('Reading package lists... Done');
            } else if (args[0] === 'install') {
              const pkgs = args.slice(1).filter(p => !p.startsWith('-'));
              pkgs.forEach(p => installed.add(p));
              log(`Reading package lists... Done`);
              log(`Building dependency tree... Done`);
              log(`The following NEW packages will be installed: ${pkgs.join(' ')}`);
              log(`0 upgraded, ${pkgs.length} newly installed, 0 to remove.`);
              log(`Setting up ${pkgs.join(' ')}...`);
            }
            break;
          case 'ip':
            if (args.join(' ').includes('addr') || args.join(' ').includes('a')) {
               let output = `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000\n    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00\n    inet 127.0.0.1/8 scope host lo\n       valid_lft forever preferred_lft forever\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000\n    link/ether 52:54:00:12:34:56 brd ff:ff:ff:ff:ff:ff\n    inet 10.0.2.15/24 brd 10.0.2.255 scope global dynamic eth0\n       valid_lft 86353sec preferred_lft 86353sec`;
               if (installed.has('wireguard') && cmd.includes('wg0')) {
                   // Mock wg0 if conceptually active
               }
               log(output);
            } else if (args[0] === 'link') {
                log('1: lo: <LOOPBACK,UP,LOWER_UP> ...\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> ...');
            } else if (args[0] === 'route') {
                log('default via 10.0.2.2 dev eth0 proto dhcp metric 100\n10.0.2.0/24 dev eth0 proto kernel scope link src 10.0.2.15 metric 100');
            } else {
                log('ip: command not fully simulated');
            }
            break;
          case 'ufw':
            if (args[0] === 'status') log('Status: inactive');
            else if (args[0] === 'enable') log('Firewall is active and enabled on system startup');
            else if (args[0] === 'disable') log('Firewall stopped and disabled on system startup');
            break;
          case 'sysctl':
            if (args[0] === '-w' && args[1]) log(`${args[1]} = ${args[1].split('=')[1] || ''}`);
            else log('sysctl: usage error');
            break;
          case 'iptables':
            // Silent success
            break;
          case 'wg':
            if (!installed.has('wireguard')) {
                log('bash: wg: command not found');
            } else {
                if (args[0] === 'genkey') log('sB5...privatekey...');
                else if (args[0] === 'pubkey') log('Pz8...publickey...');
                else log('interface: wg0\n  public key: Pz8...\n  private key: (hidden)\n  listening port: 51820');
            }
            break;
          case 'wg-quick':
            if (!installed.has('wireguard')) {
                log('bash: wg-quick: command not found');
            } else {
                log(`[#] ip link add ${args[1] || 'wg0'} type wireguard\n[#] wg setconf ${args[1] || 'wg0'} /dev/fd/63\n[#] ip -4 address add 10.10.0.1/24 dev ${args[1] || 'wg0'}\n[#] ip link set mtu 1420 up dev ${args[1] || 'wg0'}`);
            }
            break;
          case 'openvpn':
            if (!installed.has('openvpn')) {
                log('bash: openvpn: command not found');
            } else {
                log('OpenVPN 2.4.7 x86_64-pc-linux-gnu [SSL (OpenSSL)] [LZO] [LZ4] [EPOLL] [PKCS11] [MH/PKTINFO] [AEAD] built on Feb 20 2019');
            }
            break;
          case './easyrsa':
          case 'make-cadir':
             if (!installed.has('easy-rsa') && !installed.has('openvpn')) {
                  log(`bash: ${base}: command not found`);
             } else {
                  if (base === 'make-cadir') {
                      log(`Copying Easy-RSA to ${args[0]}...`);
                      setFileSystem(prev => ({...prev, [args[0]]: ['easyrsa', 'pki/']}));
                  }
                  else if (args[0] === 'init-pki') log('init-pki complete; you may now create a CA or requests.');
                  else if (args[0] === 'build-ca') log('CA creation complete and you may now import and sign cert requests.');
                  else if (args[0] === 'gen-req') log('Keypair and certificate request generated.');
                  else if (args[0] === 'sign-req') log('Certificate created at: ...');
                  else if (args[0] === 'gen-dh') log('DH parameters of size 2048 created at ...');
             }
             break;
          case 'tcpdump':
             if (!installed.has('tcpdump')) { log('bash: tcpdump: command not found'); break; }
             log('tcpdump: verbose output suppressed, use -v or -vv for full protocol decode');
             log(`listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes`);
             log('12:34:56.789012 IP 10.0.2.15.22 > 10.0.2.2.54321: Flags [P.], seq 1:53, ack 1, win 502, options [nop,nop,TS val 12345 ecr 67890], length 52');
             log('12:34:56.789123 IP 10.0.2.2.54321 > 10.0.2.15.22: Flags [.], ack 53, win 501, options [nop,nop,TS val 67891 ecr 12345], length 0');
             log('^C');
             log('2 packets captured');
             log('2 packets received by filter');
             log('0 packets dropped by kernel');
             break;
          case 'curl':
          case 'wget': {
             if (!installed.has('curl') && !installed.has('wget')) { log(`bash: ${base}: command not found`); break; }
             const url = args[0] || 'http://google.com';
             log(`Resolving ${url.replace('http://', '').replace('https://', '').split('/')[0]}... 142.250.183.46`);
             log(`Connecting to ${url.replace('http://', '').replace('https://', '').split('/')[0]}|142.250.183.46|:80... connected.`);
             log('HTTP request sent, awaiting response... 200 OK');
             log(`Length: unspecified [text/html]`);
             log(`Saving to: 'index.html'`);
             log('');
             log(`index.html     [ <=>    ]  15.23K  --.-KB/s    in 0.01s`);
             log('');
             log(`2023-10-27 10:00:00 (1.50 MB/s) - 'index.html' saved [15600]`);
             break;
          }
          case 'ifconfig':
             if (!installed.has('net-tools')) { log('bash: ifconfig: command not found'); break; }
             log('eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500');
             log('        inet 10.0.2.15  netmask 255.255.255.0  broadcast 10.0.2.255');
             log('        ether 52:54:00:12:34:56  txqueuelen 1000  (Ethernet)');
             log('        RX packets 1234  bytes 123456 (123.4 KB)');
             log('        TX packets 1234  bytes 123456 (123.4 KB)');
             log('');
             log('lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536');
             log('        inet 127.0.0.1  netmask 255.0.0.0');
             log('        loop  txqueuelen 1000  (Local Loopback)');
             break;
          case 'systemctl':
             log(args.length > 0 ? '' : 'systemctl: usage error');
             break;
          default:
            log(`bash: ${base}: command not found (simulation)`);
        }

        if (grepPattern) {
            const allOutput = outputBuffer.join('\n');
            const lines = allOutput.split('\n');
            const filtered = lines.filter(l => l.includes(grepPattern));
            filtered.forEach(l => setHistory(prev => [...prev, l]));
        }
      }
      setInput('');
    }
  };

  return (
    <div className="bg-black rounded-lg border border-gray-700 p-4 font-mono text-sm h-64 overflow-y-auto mb-6 flex flex-col shrink-0">
      <div className="flex-1">
        {history.map((line, i) => (
          <div key={i} className="text-gray-300 whitespace-pre-wrap">{line}</div>
        ))}
      </div>
      <div className="flex items-center text-gray-300 mt-2">
        <span className="mr-2 text-green-500">root@ubuntu:{cwd}#</span>
        <input
          className="bg-transparent outline-none flex-1 text-white"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          placeholder="Type command..."
        />
      </div>
    </div>
  );
};

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
  const [activeTab, setActiveTab] = useState<'lesson' | 'syntax' | 'terminal' | 'guide'>('lesson');
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
    const qpTab = searchParams.get('tab') as ('lesson' | 'syntax' | 'terminal' | 'guide') | null;
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
    setActiveTab(qpTab === 'syntax' || qpTab === 'terminal' || qpTab === 'guide' ? qpTab : 'lesson');
    setPageIndex(qpPage);
  }, [currentModule.id, searchParams]);

  const activeTopic = useMemo(() => currentModule.topics.find((t) => t.id === activeTopicId) || currentModule.topics[0], [currentModule, activeTopicId]);

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
    <main className={`h-screen flex flex-col ${bgClass} overflow-hidden`}>
      {/* Header strip */}
      <div className="shrink-0 max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 pt-8 pb-4">
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
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: topics list */}
        <aside className={`${isDark ? 'bg-black border-gray-700' : 'bg-[#FDF7EC] border-gray-200'} border-r w-96 p-4 h-full overflow-y-auto shrink-0`}>
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
        <section className="rounded-lg border border-white/15 bg-white/5 p-4 flex flex-col flex-1 overflow-hidden h-full">
          {/* Top Bar: Tabs + Date/Time */}
          <div className={`shrink-0 flex items-center justify-between mb-4 border-b ${isDark ? 'border-white/15' : 'border-gray-200'} pb-2`}>
            <div className="flex items-center gap-2">
              <TabButton label="Lesson" active={activeTab === 'lesson'} onClick={() => setActiveTab('lesson')} isDark={isDark} />
              <TabButton label="Syntax" active={activeTab === 'syntax'} onClick={() => setActiveTab('syntax')} isDark={isDark} />
              <TabButton label="Terminal" active={activeTab === 'terminal'} onClick={() => setActiveTab('terminal')} isDark={isDark} />
              <TabButton label="Guide" active={activeTab === 'guide'} onClick={() => setActiveTab('guide')} isDark={isDark} />
            </div>
            <div className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{now.toLocaleDateString()} {now.toLocaleTimeString()}</div>
          </div>

          {/* Two-column layout with Personal Teacher chat */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_480px] gap-4 flex-1 overflow-hidden min-h-0">
            {/* Left: main content per tab */}
            <div className="overflow-y-auto h-full pr-2">
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
                ) : activeTopic.id === 'ufw-management' ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Enable and Disable UFW</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ufw enable
ufw disable`}</code></pre>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Set Default Policies</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ufw default deny incoming
ufw default allow outgoing`}</code></pre>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Allow Services</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ufw allow ssh
ufw allow http
ufw allow https`}</code></pre>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Allow Custom Ports</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ufw allow 8080/tcp`}</code></pre>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Deny a Port</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ufw deny 21`}</code></pre>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Limit SSH (Anti-Brute Force)</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ufw limit ssh`}</code></pre>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Enable Logging</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ufw logging on`}</code></pre>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Check Status</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ufw status verbose`}</code></pre>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Delete a Rule</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ufw delete allow 8080`}</code></pre>
                    </div>
                  </div>
                ) : activeTopic.id === 'iptables-config' ? (
                  <div className="space-y-6">
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Lab Objective</h3>
                      <p className="mb-4">Configure a basic secure firewall using iptables.</p>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 1: Check Current Rules</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -L -v -n`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 2: Set Secure Default Policies</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 3: Allow Loopback</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -A INPUT -i lo -j ACCEPT`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 4: Allow Established Connections</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 5: Allow SSH Access</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -A INPUT -p tcp --dport 22 -j ACCEPT`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 6: Test Connectivity</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ping google.com
ssh user@server-ip`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 7: Verify Rules</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -L -v -n`}</code></pre>
                    </div>
                  </div>
                ) : activeTopic.id === 'nat-dnat-snat' ? (
                  <div className="space-y-6">
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Lab Goal: Share internet from Linux gateway to LAN.</h3>
                      <p className="mb-4">Configure iptables to act as a NAT gateway.</p>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 1: Enable Masquerading</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 2: Allow Forwarding from LAN</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -A FORWARD -i eth1 -o eth0 -j ACCEPT`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 3: Allow Established Connections</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -A FORWARD -i eth0 -o eth1 -m state --state ESTABLISHED,RELATED -j ACCEPT`}</code></pre>
                    </div>
                  </div>
                ) : activeTopic.id === 'iptables-config' ? (
                  <div className="space-y-6">
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Lab Objective</h3>
                      <p className="mb-4">Configure a secure host-based firewall using iptables.</p>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 1: Set Default Policies</h3>
                      <p className="mb-2 text-sm opacity-80">Drop all incoming traffic by default for security.</p>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 2: Allow Loopback Traffic</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 3: Allow Established Connections</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 4: Allow Specific Services (SSH & HTTP)</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 5: Verify Rules</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -L -v -n`}</code></pre>
                    </div>
                  </div>
                ) : activeTopic.id === 'nat-masquerade' ? (
                  <div className="space-y-6">
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Lab Objective</h3>
                      <p className="mb-4">Configure Source NAT (SNAT) and Destination NAT (DNAT) using iptables.</p>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 1: Enable IP Forwarding</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`echo 1 > /proc/sys/net/ipv4/ip_forward`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 2: Configure Masquerade (SNAT)</h3>
                      <p className="mb-2 text-sm opacity-80">Allow internal private IPs to access the internet via the public interface (eth0).</p>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 3: Configure Port Forwarding (DNAT)</h3>
                      <p className="mb-2 text-sm opacity-80">Forward incoming traffic on port 8080 to an internal server at 192.168.1.50:80.</p>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 8080 -j DNAT --to-destination 192.168.1.50:80`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 4: Allow Forwarded Traffic</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -A FORWARD -p tcp -d 192.168.1.50 --dport 80 -j ACCEPT`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 5: Verify NAT Table</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -t nat -L -v -n`}</code></pre>
                    </div>
                  </div>
                ) : activeTopic.id === 'pfsense-intro' ? (
                  <div className="space-y-6">
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Lab Objective</h3>
                      <p className="mb-4">Simulate firewall appliance management tasks (Interface assignment and Rule verification).</p>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 1: Check Interface Status</h3>
                      <p className="mb-2 text-sm opacity-80">In a real pfSense/BSD system, you would use console options. Here we verify network links.</p>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ip link show`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 2: Simulate WAN/LAN Assignment</h3>
                      <p className="mb-2 text-sm opacity-80">Rename interfaces to mimic a firewall setup (conceptual).</p>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`# Assign eth0 as WAN
ip addr add 192.0.2.10/24 dev eth0

# Assign eth1 as LAN (simulation)
ip link add eth1 type dummy
ip link set eth1 up
ip addr add 192.168.1.1/24 dev eth1`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 3: Enable Packet Filtering</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`sysctl -w net.ipv4.ip_forward=1
iptables -P FORWARD DROP`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 4: Allow LAN to WAN</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -A FORWARD -i eth1 -o eth0 -j ACCEPT
iptables -A FORWARD -i eth0 -o eth1 -m state --state ESTABLISHED,RELATED -j ACCEPT`}</code></pre>
                    </div>
                  </div>
                ) : activeTopic.id === 'firewalld-zones' ? (
                  <div className="space-y-6">
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Run Rich Rule</h3>
                      <p className="mb-4">Add a rich rule to drop traffic from a specific IP.</p>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`firewall-cmd --zone=public --add-rich-rule='rule family=ipv4 source address=192.168.1.50 drop'`}</code></pre>
                    </div>
                  </div>
                ) : activeTopic.id === 'pfsense-intro' ? (
                  <div className="space-y-6">
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Lab Objective</h3>
                      <p className="mb-4">Deploy pfSense as a firewall and understand its interface.</p>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Lab Steps (Conceptual)</h3>
                      <ol className="list-decimal ml-6 space-y-2">
                        <li>Install pfSense in VirtualBox / Proxmox</li>
                        <li>Assign WAN and LAN interfaces</li>
                      </ol>
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
                <div className="h-full flex flex-col">
                  <TerminalSimulation />
                  <div className={`mt-4 p-4 rounded border ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Use this terminal to practice the commands. Switch to the <strong>Guide</strong> tab for step-by-step instructions.
                    </p>
                  </div>
                </div>
              )}

              {/* Guide (formerly Terminal content) */}
              {activeTab === 'guide' && (
                activeTopic.id === 'iptables-config' ? (
                  <div className="space-y-6">
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Lab Objective</h3>
                      <p className="mb-4">Configure a secure host-based firewall using iptables.</p>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 1: Set Default Policies</h3>
                      <p className="mb-2 text-sm opacity-80">Drop all incoming traffic by default for security.</p>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 2: Allow Loopback Traffic</h3>
                      <p className="mb-2 text-sm opacity-80">Essential for local services.</p>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -A INPUT -i lo -j ACCEPT`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 3: Allow Established Connections</h3>
                      <p className="mb-2 text-sm opacity-80">Permit return traffic for outgoing requests.</p>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 4: Allow SSH & HTTP</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 5: Verify Rules</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -L -v`}</code></pre>
                    </div>
                  </div>
                ) : activeTopic.id === 'nat-dnat-snat' ? (
                  <div className="space-y-6">
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Lab Objective</h3>
                      <p className="mb-4">Configure Network Address Translation (NAT) for internet access and port forwarding.</p>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 1: Enable IP Forwarding</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`echo 1 > /proc/sys/net/ipv4/ip_forward`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 2: Configure SNAT (Masquerade)</h3>
                      <p className="mb-2 text-sm opacity-80">Allow internal LAN (eth1) to access internet via WAN (eth0).</p>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 3: Configure DNAT (Port Forwarding)</h3>
                      <p className="mb-2 text-sm opacity-80">Forward incoming port 8080 traffic to internal server 192.168.1.50.</p>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -t nat -A PREROUTING -p tcp --dport 8080 -j DNAT --to-destination 192.168.1.50:80`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 4: Verify NAT Table</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -t nat -L -v -n`}</code></pre>
                    </div>
                  </div>
                ) : activeTopic.id === 'pfsense-intro' ? (
                  <div className="space-y-6">
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Lab Objective</h3>
                      <p className="mb-4">Simulate firewall appliance management tasks (Interface assignment and Rule verification).</p>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 1: Check Interface Status</h3>
                      <p className="mb-2 text-sm opacity-80">In a real pfSense/BSD system, you would use console options. Here we verify network links.</p>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ip link show`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 2: Simulate WAN/LAN Assignment</h3>
                      <p className="mb-2 text-sm opacity-80">Assign IP addresses to simulate WAN and LAN interfaces.</p>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ip addr add 192.168.1.1/24 dev eth0  # LAN
ip addr add 203.0.113.10/24 dev eth1  # WAN`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 3: Enable Packet Filtering</h3>
                      <p className="mb-2 text-sm opacity-80">Ensure forwarding is enabled to act as a gateway.</p>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`sysctl -w net.ipv4.ip_forward=1`}</code></pre>
                    </div>

                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Step 4: Verify Routing Table</h3>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ip route show`}</code></pre>
                    </div>
                  </div>
                ) : activeTopic.id === 'ufw-management' ? (
                  <div className="space-y-6">
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Lab Objective</h3>
                        <p className="mb-4">Secure an Ubuntu server using UFW best practices.</p>
                      </div>

                      <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                        <h3 className="text-lg font-semibold mb-2">Step 1: Reset Existing Rules</h3>
                        <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ufw reset`}</code></pre>
                      </div>

                      <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                        <h3 className="text-lg font-semibold mb-2">Step 2: Configure Secure Defaults</h3>
                        <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ufw default deny incoming
ufw default allow outgoing`}</code></pre>
                      </div>

                      <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                        <h3 className="text-lg font-semibold mb-2">Step 3: Allow SSH Access</h3>
                        <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ufw allow ssh`}</code></pre>
                      </div>

                      <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                        <h3 className="text-lg font-semibold mb-2">Step 4: Allow Web Traffic</h3>
                        <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ufw allow 80
ufw allow 443`}</code></pre>
                      </div>

                      <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                        <h3 className="text-lg font-semibold mb-2">Step 5: Enable Firewall</h3>
                        <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ufw enable`}</code></pre>
                      </div>

                      <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                        <h3 className="text-lg font-semibold mb-2">Step 6: Enable Logging</h3>
                        <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ufw logging medium`}</code></pre>
                      </div>

                      <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                        <h3 className="text-lg font-semibold mb-2">Step 7: Verify Rules</h3>
                        <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`ufw status verbose`}</code></pre>
                      </div>
                    </div>
                ) : activeTopic.id === 'port-forwarding' ? (
                  <div className="space-y-6">
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Lab Objective</h3>
                        <p className="mb-4">Secure a Linux server by controlling exposed services.</p>
                      </div>

                      <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                        <h3 className="text-lg font-semibold mb-2">Step 1: Block Insecure Ports</h3>
                        <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -A INPUT -p tcp --dport 21 -j DROP
iptables -A INPUT -p tcp --dport 23 -j DROP`}</code></pre>
                      </div>

                      <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                        <h3 className="text-lg font-semibold mb-2">Step 2: Forward Web Traffic</h3>
                        <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -t nat -A PREROUTING -p tcp --dport 8080 -j DNAT --to 192.168.1.10:80
iptables -A FORWARD -p tcp -d 192.168.1.10 --dport 80 -j ACCEPT`}</code></pre>
                      </div>

                      <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                        <h3 className="text-lg font-semibold mb-2">Step 3: Verify Rules</h3>
                        <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -L -v -n
iptables -t nat -L -v -n`}</code></pre>
                      </div>
                    </div>
                ) : activeTopic.id === 'linux-router-firewall' ? (
                  <div className="space-y-6">
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Lab Objective</h3>
                        <p className="mb-4">Configure Linux as a secure router and firewall.</p>
                      </div>

                      <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                        <h3 className="text-lg font-semibold mb-2">Step 1: Enable IP Forwarding</h3>
                        <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`echo 1 > /proc/sys/net/ipv4/ip_forward`}</code></pre>
                      </div>

                      <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                        <h3 className="text-lg font-semibold mb-2">Step 2: Configure NAT</h3>
                        <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE`}</code></pre>
                      </div>

                      <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                        <h3 className="text-lg font-semibold mb-2">Step 3: Allow Forwarding</h3>
                        <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -A FORWARD -i eth1 -o eth0 -j ACCEPT
iptables -A FORWARD -i eth0 -o eth1 -m state --state ESTABLISHED,RELATED -j ACCEPT`}</code></pre>
                      </div>

                      <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                        <h3 className="text-lg font-semibold mb-2">Step 4: Verify Configuration</h3>
                        <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -L -v -n
ip route show`}</code></pre>
                      </div>
                    </div>
                ) : activeTopic.id === 'openvpn-setup' ? (
                  <div className="space-y-6">
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Lab Objective</h3>
                        <p className="mb-4">Set up a secure OpenVPN server and connect a client.</p>
                      </div>

                      <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                        <h3 className="text-lg font-semibold mb-2">Step 1: Server Configuration (server.conf)</h3>
                        <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`port 1194
proto udp
dev tun
ca ca.crt
cert server.crt
key server.key
dh dh.pem
server 10.8.0.0 255.255.255.0
keepalive 10 120
cipher AES-256-CBC
persist-key
persist-tun
status openvpn-status.log
verb 3`}</code></pre>
                      </div>

                      <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                        <h3 className="text-lg font-semibold mb-2">Step 2: Enable IP Forwarding</h3>
                        <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`sysctl -w net.ipv4.ip_forward=1`}</code></pre>
                      </div>

                      <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                        <h3 className="text-lg font-semibold mb-2">Step 3: NAT for VPN Clients</h3>
                        <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -o eth0 -j MASQUERADE`}</code></pre>
                      </div>

                      <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                        <h3 className="text-lg font-semibold mb-2">Step 4: Client Configuration (client.ovpn)</h3>
                        <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`client
dev tun
proto udp
remote SERVER_IP 1194
resolv-retry infinite
nobind
persist-key
persist-tun
cipher AES-256-CBC
verb 3`}</code></pre>
                      </div>

                      <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                        <h3 className="text-lg font-semibold mb-2">Step 5: Connect Client</h3>
                        <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`openvpn --config client.ovpn`}</code></pre>
                      </div>
                    </div>
                ) : activeTopic.id === 'wireguard-config' ? (
                  <div className="space-y-6">
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Lab Objective</h3>
                        <p className="mb-4">Deploy a secure WireGuard VPN tunnel.</p>
                      </div>

                      <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                        <h3 className="text-lg font-semibold mb-2">Step 1: Enable IP Forwarding</h3>
                        <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`sysctl -w net.ipv4.ip_forward=1`}</code></pre>
                      </div>

                      <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                        <h3 className="text-lg font-semibold mb-2">Step 2: NAT for VPN Traffic</h3>
                        <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -t nat -A POSTROUTING -s 10.10.0.0/24 -o eth0 -j MASQUERADE`}</code></pre>
                      </div>

                      <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                        <h3 className="text-lg font-semibold mb-2">Step 3: Start VPN</h3>
                        <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`wg-quick up wg0`}</code></pre>
                      </div>

                      <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                        <h3 className="text-lg font-semibold mb-2">Step 4: Verify Tunnel</h3>
                        <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`wg
ip addr show wg0`}</code></pre>
                      </div>
                    </div>
                ) : activeTopic.id === 'interfaces-links-routes' ? (
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
                ) : activeTopic.id === 'firewalld-zones' ? (
                  <div className="space-y-6">
                    <div className="rounded-md overflow-hidden border border-white/20">
                      <iframe
                        title="terminal"
                        src="https://copy.sh/v86/?profile=archlinux&options=cdrom,bios&cdrom=https://dl-cdn.alpinelinux.org/alpine/v3.18/releases/x86_64/alpine-standard-3.18.0-x86_64.iso"
                        className="w-full h-[500px] bg-black"
                      />
                    </div>
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Run Rich Rule</h3>
                      <p className="mb-4">Add a rich rule to drop traffic from a specific IP.</p>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`firewall-cmd --zone=public --add-rich-rule='rule family=ipv4 source address=192.168.1.50 drop'`}</code></pre>
                    </div>
                    <div className={(isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200') + ' rounded-xl border p-6 shadow-lg'}>
                      <h3 className="text-lg font-semibold mb-2">Terminal Guide (NAT Reference)</h3>
                      <h4 className="font-medium mt-4 mb-2">Step 1: Enable Masquerading</h4>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE`}</code></pre>
                      <h4 className="font-medium mt-4 mb-2">Step 2: Allow Forwarding from LAN</h4>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -A FORWARD -i eth1 -o eth0 -j ACCEPT`}</code></pre>
                      <h4 className="font-medium mt-4 mb-2">Step 3: Allow Established Connections</h4>
                      <pre className="bg-black/60 rounded-md p-3 overflow-auto text-sm"><code>{`iptables -A FORWARD -i eth0 -o eth1 -m state --state ESTABLISHED,RELATED -j ACCEPT`}</code></pre>
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
            <div className="w-full xl:w-[480px] shrink-0 h-full overflow-hidden flex flex-col"><ChatPanel isDark={isDark} messages={chatMessages} loading={chatLoading} onSend={sendChat} /></div>
          </div>
        </section>
      </div>
    </main>
  );
}
