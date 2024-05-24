import { Request, Response } from "express";
import userService from "../User/user.service";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import customJSONStringifier from "../File/utils/customJSONStringifier";
import contactService from "./contact.service";
import { Contact } from "./contact.entity";

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

      return res.status(200).send(customJSONStringifier(contacts));
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

      const thisUser = await userService.getUserById(userData.id);

      if (!thisUser)
        return res.status(400).json({ message: "Error: Cannot find user" });

      const candidateContact = await contactService.checkIsNewContact(
        thisUser,
        currentContact
      );

      if (candidateContact) {
        return res
          .status(400)
          .json({ message: "Error: Contact already exists" });
      }

      const newContact = await contactService.addNewContact({
        user: thisUser,
        contact: currentContact,
      });

      if (!newContact)
        return res.status(400).json({ message: "Error: Cannot add contact" });

      return res.status(200).send(
        customJSONStringifier({
          ...newContact,
          user: (({ password, ...o }) => o)(thisUser),
          contactUser: (({ password, ...o }) => o)(currentContact),
        } as Contact)
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

      const currentContact = await userService.getUserById(userContact);

      if (!currentContact)
        return res.status(400).json({ message: "Error: Cannot find contact" });

      const user = await userService.getUserById(userData.id);

      if (!user)
        return res.status(400).json({ message: "Error: Cannot find user" });

      const response = await contactService.checkIsNewContact(
        user,
        currentContact
      );

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

      return res.status(200).send(customJSONStringifier(response));
    } catch (e) {
      res.status(500).json({ message: `Error: ${e}` });
    }
  }
}

export default new ContactController();
