import { BadRequestException, PipeTransform } from "@nestjs/common";
import { BoardStatus } from "../board.status.enum";

export class BoardStatusValidationPipe implements PipeTransform{
    readonly StatusOptions = [
        BoardStatus.PRIVATE,
        BoardStatus.PUBLIC
    ]//위 두개가 옵션

    transform(value: any) {
        value = value.toUpperCase();
        if(!this.isStatusValid(value)){
            throw new BadRequestException(`${value} isn't in the stauts options`);
        }
        return value;
    }
    private isStatusValid(status: any){
        const index = this.StatusOptions.indexOf(status);
        return index !== -1
    }
}