# Plataforma web de historias clínicas basada en blockchain.

Advisor: Pedro Wightman

Authors:  -Luis Alfredo Pérez Linares
          -Giordy Romero
          -Omar Gutierrez

Tecnologies: Blockchain, Ethereum (Geth), Solidity (Smart Contracts), ReactJS (Javascript), HTML/CSS.

Blockchain-Based Electronic Medical Records (EMR) Prototype implementing patient-centered privacy policies. This system seeks to centralize all medical information from patients on a geographical area (City, Country, etc.). The use of Blockchain in this architecture aims to ensure information safety regarding data modification or alteration.

EMR information in our system uses HL7 (EMR/EHR Standard), so it would be easier to integrate systems from different entities and make them part of the network.

As information in the Blockchain is public and shared among all computers in the network, our system encrypts HL7 data before storing it in the blockchain using symetric AES Cipher Algorithm. The patient who owns the data provides a password/key to encrypt HL7 data when storing it or decrypt it when retrieving it. All users who knows the patient's password/key, will be able to get the patient's EMR in decrypted HL7 format. Patients can share their Password/Key with other users (let's say his Doctor), so they can get access to the patient's decrypted information.

Also, through logic coded in the blockchain contrats, we implemented a permission system in which patients can choose the users that will be able to get his information, and the amount of information they will see. 

This project started as an undergradute (Systems Engineering Degree) project, and it was continued later on a doctoral thesis. As an outcome of that work we got an article published. There you can find more detail about the architecture proposed in this system. The paper can be found in the following link.
https://www.mdpi.com/1660-4601/17/19/7132
