import { Request, Response } from "express";
import userService from "../User/user.service";
import bcrypt from "bcryptjs";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import fileService from "../File/file.service";
import customJSONStringifier from "../File/utils/customJSONStringifier";
import contactService from "./contact.service";
import { ContactProps } from "./contact.types";
import { User } from "../User/user.entity";

class ContactController {
  // public async checkIsAuth(req: Request, res: Response) {
  //   try {
  //     const token = req.headers.authorization?.split(" ")[1];

  //     if (!token)
  //       return res.status(401).json({ message: "Error: Wrong token" });

  //     const userData = verifyTokenMiddleware(token);

  //     if (!userData)
  //       return res.status(403).json({ message: "Error: Token was expired" });

  //     const user = await userService.getUserById(userData.id);

  //     if (!user)
  //       return res.status(400).json({ message: "Error: Cannot find user" });

  //     return res.status(200).send(
  //       customJSONStringifier({
  //         token,
  //         user: (({ password, ...o }) => o)(user),
  //       })
  //     );
  //   } catch (e) {
  //     res.status(500).json({ message: `Error: ${e}` });
  //   }
  // }

  // public async registerUser(req: Request, res: Response) {
  //   try {
  //     const registerParams: RegisterProps = req.body;

  //     // const empties = Object.values(registerParams).filter((param) => {
  //     //   return param.toString().trim().length === 0;
  //     // });
  //     const candidate = await userService.checkIsNewUser(registerParams.login);

  //     if (!candidate) {
  //       return res.status(400).json({
  //         message: `User with login ${registerParams.login} is already exists`,
  //       });
  //     }

  //     const hashPassword = bcrypt.hashSync(
  //       registerParams.password,
  //       this.hashSalt
  //     );

  //     const token = await userService.createNewUser({
  //       ...registerParams,
  //       password: hashPassword,
  //     });

  //     if (token) {
  //       return res.status(200).json({
  //         message: `User was created`,
  //       });
  //     } else {
  //       return res.status(400).json({
  //         message: `User with login ${registerParams.login} is already exists`,
  //       });
  //     }
  //   } catch (e) {
  //     res.status(500).json({ message: `Error: ${e}` });
  //   }
  // }

  public async getAllContacts(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token)
        return res.status(401).json({ message: "Error: Wrong token" });

      const userData = verifyTokenMiddleware(token);

      if (!userData)
        return res.status(403).json({ message: "Error: Token was expired" });

      const user = await userService.getUserById(userData.id);

      if (!user)
        return res.status(400).json({ message: "Error: Cannot find user" });

      const contacts = await contactService.getUserContacts(user);

      return res.status(200).send(
        customJSONStringifier({
          contacts: contacts ?? [],
        })
      );
    } catch (e) {
      res.status(500).json({ message: `Error: ${e}` });
    }
  }

  public async addContact(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token)
        return res.status(401).json({ message: "Error: Wrong token" });

      const userData = verifyTokenMiddleware(token);

      if (!userData)
        return res.status(403).json({ message: "Error: Token was expired" });

      const { contact }: { contact: string } = req.body;

      if (!contact)
        return res.status(400).json({ message: "Error: Wrong contact id" });

      const currentContact = await userService.getUserById(contact);

      if (!currentContact)
        return res.status(400).json({ message: "Error: Cannot find contact" });

      const user = await userService.getUserById(userData.id);

      if (!user)
        return res.status(400).json({ message: "Error: Cannot find user" });

      const candidateContact = await contactService.checkIsNewContact(
        user,
        currentContact
      );

      if (!candidateContact) {
        return res
          .status(400)
          .json({ message: "Error: Contact already exists" });
      }

      const newContact = await contactService.addNewContact({
        user,
        contact: currentContact,
      });

      if (!newContact)
        return res.status(400).json({ message: "Error: Cannot add contact" });

      return res.status(200).send(
        customJSONStringifier({
          contact,
        })
      );
    } catch (e) {
      res.status(500).json({ message: `Error: ${e}` });
    }
  }

  public async removeContact(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token)
        return res.status(401).json({ message: "Error: Wrong token" });

      const userData = verifyTokenMiddleware(token);

      if (!userData)
        return res.status(403).json({ message: "Error: Token was expired" });

      const { userContact }: { userContact: string } = req.body;

      if (!userContact)
        return res.status(400).json({ message: "Error: Wrong contact" });
      console.log("ID: ", userContact);

      const currentContact = await userService.getUserById(userContact);
      console.log("User to remove from Contacts: ", currentContact);

      if (!currentContact)
        return res.status(400).json({ message: "Error: Cannot find contact" });

      const user = await userService.getUserById(userData.id);

      if (!user)
        return res.status(400).json({ message: "Error: Cannot find user" });

      const response = await contactService.checkIsNewContact(
        user,
        currentContact
      );
      console.log(response);

      if (!response) {
        return res.status(400).json({ message: "Error: Cannot find contact" });
      }

      const removed = await contactService.removeContact({
        user,
        contact: currentContact,
      });

      if (!removed)
        return res
          .status(400)
          .json({ message: "Error: Cannot remove contact" });

      return res.status(200).send(
        customJSONStringifier({
          response,
        })
      );
    } catch (e) {
      res.status(500).json({ message: `Error: ${e}` });
    }
  }
}

export default new ContactController();
